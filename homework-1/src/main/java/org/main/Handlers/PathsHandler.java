package org.main.Handlers;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import org.main.Static.HTTP_CODES;
import org.main.Static.HTTP_VERBS;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URI;
import org.json.JSONObject;
import org.main.Static.ResponseData;
import org.main.Utils;

public class PathsHandler {
    public static void handleRequest(HttpExchange exchange, String verb, ProcessRequest request) throws IOException {
        String method = exchange.getRequestMethod();
        String verb_  = HTTP_VERBS.fromString(method);

        URI requestURI = exchange.getRequestURI();
        String query = requestURI.getQuery();
        JSONObject dataQuery = getParametersFromQuery(query);

        InputStream requestBody = exchange.getRequestBody();

        Object response;
        int statusCode;

        if (verb.equals(verb_)) {
            try {
                JSONObject requestBodyJson = requestBody.available() == 0 ? dataQuery : Utils.toJson(requestBody);
                ResponseData responseData = request.processRequest(requestBodyJson);

                response = responseData.getJsoObject();
                statusCode = responseData.getStatusCode();
            } catch (Exception e) {
                System.out.println(e.getMessage());
                response = new JSONObject().put("error", "Internal Server Error");
                statusCode = HTTP_CODES.INTERNAL_SERVER_ERROR;
            }
        } else {
            response = new JSONObject().put("error", "Bad Request, wrong method");
            statusCode = HTTP_CODES.NOT_ALLOWED;
        }

        sendResponse(exchange, response.toString(), statusCode);
    }


    private static JSONObject getParametersFromQuery(String query) {
        JSONObject requestBodyJson = new JSONObject();

        if (query != null && !query.isEmpty()) {
            String[] params = query.split("&");
            for (String param : params) {
                String[] keyValue = param.split("=");
                if (keyValue.length == 2) {
                    requestBodyJson.put(keyValue[0], keyValue[1]);
                }
            }
        }

        return requestBodyJson;
    }

    private static void sendResponse(HttpExchange exchange, String response, int statusCode) throws IOException {
        Headers responseHeaders = exchange.getResponseHeaders();
        responseHeaders.add("Content-Type", "application/json");
        responseHeaders.add("Access-Control-Allow-Origin", "*");
        responseHeaders.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        responseHeaders.add("Access-Control-Allow-Headers", "Content-Type, Authorization");

        if (statusCode == HTTP_CODES.NO_CONTENT) {
            exchange.sendResponseHeaders(statusCode, -1);
        } else {
            exchange.sendResponseHeaders(statusCode, response.getBytes().length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }
    }

    public static void handleCors(HttpExchange exchange) throws IOException {
        String origin = exchange.getRequestHeaders().getFirst("Origin");
        if (origin != null) {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization");

            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                exchange.sendResponseHeaders(HTTP_CODES.OK, -1);
            }
        }
    }
}
