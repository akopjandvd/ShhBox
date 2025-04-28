package com.shhbox.resource;

import com.shhbox.model.FileEntity;
import com.shhbox.security.EncryptionUtil;
import com.shhbox.auth.JwtUtil;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;

import java.io.InputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.nio.file.Files;

@Path("/files")
@RequestScoped
@Transactional
public class FileUploadResource {

    @PersistenceContext(unitName = "shhboxPU")
    EntityManager em;

    private static final java.nio.file.Path UPLOAD_DIR = java.nio.file.Path.of("/opt/payara/uploads");

    private String extractUsername(HttpHeaders headers) {
        String authHeader = headers.getHeaderString(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                return JwtUtil.getUsernameFromToken(authHeader.substring("Bearer ".length()));
            } catch (Exception e) {
                throw new WebApplicationException("Invalid token", Response.Status.UNAUTHORIZED);
            }
        }
        throw new WebApplicationException("Missing token", Response.Status.UNAUTHORIZED);
    }

    private FileEntity getFileByIdAndUser(Long id, String username) {
        FileEntity file = em.find(FileEntity.class, id);
        if (file == null || !file.getUploadedBy().equals(username)) {
            throw new WebApplicationException("Access denied", Response.Status.FORBIDDEN);
        }
        return file;
    }

    private java.nio.file.Path resolvePath(String storedName) {
        return UPLOAD_DIR.resolve(storedName);
    }

    private void ensureUploadDirExists() throws IOException {
        if (!Files.exists(UPLOAD_DIR)) {
            Files.createDirectories(UPLOAD_DIR);
        }
    }

    @POST
    @Path("/upload")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.TEXT_PLAIN)
    public Response uploadFile(
            @FormDataParam("file") InputStream fileInputStream,
            @FormDataParam("file") FormDataContentDisposition fileMetaData,
            @Context HttpHeaders headers) {

        try {
            ensureUploadDirExists();

            String storedName = UUID.randomUUID() + "_" + fileMetaData.getFileName();
            java.nio.file.Path filePath = resolvePath(storedName);
            try (OutputStream out = Files.newOutputStream(filePath)) {
                EncryptionUtil.encrypt(fileInputStream, out);
            }

            String username = extractUsername(headers);

            FileEntity file = new FileEntity();
            file.setOriginalName(fileMetaData.getFileName());
            file.setStoredName(storedName);
            file.setUploadedBy(username);
            file.setUploadTime(LocalDateTime.now());
            file.setPublicToken(UUID.randomUUID().toString());
            em.persist(file);

            return Response.ok("File uploaded as " + storedName).build();

        } catch (IOException e) {
            return Response.serverError().entity("File upload failed: " + e.getMessage()).build();
        }
    }

    @GET
    @Path("/download/{id}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadFile(@PathParam("id") Long id, @Context HttpHeaders headers) {
        String username = extractUsername(headers);
        FileEntity file = getFileByIdAndUser(id, username);

        java.nio.file.Path path = resolvePath(file.getStoredName());
        if (!Files.exists(path)) {
            return Response.status(Response.Status.NOT_FOUND).entity("File not found on disk").build();
        }

        StreamingOutput stream = out -> {
            try (InputStream in = Files.newInputStream(path)) {
                EncryptionUtil.decrypt(in, out);
            }
        };

        return Response.ok(stream)
                .header("Content-Disposition", "attachment; filename=\"" + file.getOriginalName() + "\"")
                .build();
    }

    @GET
    @Path("/public/{token}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response downloadPublic(@PathParam("token") String token) {
        List<FileEntity> results = em.createQuery("SELECT f FROM FileEntity f WHERE f.publicToken = :token", FileEntity.class)
                .setParameter("token", token)
                .getResultList();

        FileEntity file = results.isEmpty() ? null : results.getFirst();
        if (file == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        java.nio.file.Path path = resolvePath(file.getStoredName());
        if (!Files.exists(path)) {
            return Response.status(Response.Status.NOT_FOUND).entity("File not found on disk").build();
        }

        StreamingOutput stream = out -> {
            try (InputStream in = Files.newInputStream(path)) {
                EncryptionUtil.decrypt(in, out);
            }
        };

        return Response.ok(stream)
                .header("Content-Disposition", "attachment; filename=\"" + file.getOriginalName() + "\"")
                .build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response listFiles(@Context HttpHeaders headers) {
        String username = extractUsername(headers);
        List<FileEntity> files = em.createQuery("SELECT f FROM FileEntity f WHERE f.uploadedBy = :username", FileEntity.class)
                .setParameter("username", username)
                .getResultList();
        return Response.ok(files).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteFile(@PathParam("id") Long id, @Context HttpHeaders headers) {
        String username = extractUsername(headers);
        FileEntity file = getFileByIdAndUser(id, username);

        try {
            Files.deleteIfExists(resolvePath(file.getStoredName()));
        } catch (IOException e) {
            return Response.serverError().entity("Could not delete file from disk: " + e.getMessage()).build();
        }

        em.remove(file);
        return Response.ok("File deleted").build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateFile(@PathParam("id") Long id, FileEntity updatedData, @Context HttpHeaders headers) {
        String username = extractUsername(headers);
        FileEntity existing = getFileByIdAndUser(id, username);

        existing.setOriginalName(updatedData.getOriginalName());
        existing.setUploadedBy(username);
        existing.setUploadTime(updatedData.getUploadTime());

        return Response.ok(existing).build();
    }
}