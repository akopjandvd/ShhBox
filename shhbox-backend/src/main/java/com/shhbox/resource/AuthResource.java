package com.shhbox.resource;

import com.shhbox.auth.JwtUtil;
import com.shhbox.model.User;
import jakarta.enterprise.context.RequestScoped;
import jakarta.persistence.*;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import jakarta.transaction.Transactional;

@Path("/auth")
@RequestScoped
@Transactional
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @PersistenceContext(unitName = "shhboxPU")
    EntityManager em;

    public static class AuthRequest {
        public String username;
        public String password;
    }

    @POST
    @Path("register")
    public Response register(AuthRequest request) {
        TypedQuery<User> query = em.createQuery(
                "SELECT u FROM User u WHERE u.username = :username", User.class);
        query.setParameter("username", request.username);
        if (!query.getResultList().isEmpty()) {
            return Response.status(Response.Status.CONFLICT).entity("User already exists").build();
        }

        User user = new User();
        user.setUsername(request.username);
        user.setPasswordHash(Integer.toHexString(request.password.hashCode()));
        em.persist(user);

        return Response.ok("User registered").build();
    }

    @POST
    @Path("login")
    public Response login(AuthRequest request) {
        TypedQuery<User> query = em.createQuery(
                "SELECT u FROM User u WHERE u.username = :username", User.class);
        query.setParameter("username", request.username);
        User user = query.getResultStream().findFirst().orElse(null);

        if (user == null || !user.getPasswordHash().equals(Integer.toHexString(request.password.hashCode()))) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Invalid credentials").build();
        }

        String token = JwtUtil.generateToken(user.getUsername());
        return Response.ok("{\"token\":\"" + token + "\"}").build();
    }

    @POST
    @Path("/change-password")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    public Response changePassword(@Context HttpHeaders headers, AuthRequestPasswordChange request) {
        String username = JwtUtil.getUsernameFromToken(
                headers.getHeaderString(HttpHeaders.AUTHORIZATION).substring("Bearer ".length())
        );

        User user = em.createQuery("SELECT u FROM User u WHERE u.username = :username", User.class)
                .setParameter("username", username)
                .getSingleResult();

        if (!user.getPasswordHash().equals(Integer.toHexString(request.oldPassword.hashCode()))) {
            return Response.status(Response.Status.UNAUTHORIZED).entity("Old password incorrect").build();
        }

        user.setPasswordHash(Integer.toHexString(request.newPassword.hashCode()));
        return Response.ok("Password changed").build();
    }

    public static class AuthRequestPasswordChange {
        public String oldPassword;
        public String newPassword;
    }

}
