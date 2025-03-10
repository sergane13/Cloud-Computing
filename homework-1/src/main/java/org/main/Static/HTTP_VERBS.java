package org.main.Static;

public class HTTP_VERBS {
    public static final String GET = "GET";

    public static final String POST = "POST";

    public static final String PUT = "PUT";

    public static final String PATCH = "PATCH";

    public static final String DELETE = "DELETE";

    public static final String HEAD = "HEAD";

    public static final String OPTIONS = "OPTIONS";


    public static String fromString(String method) {
        if (method == null) {
            return null;
        }

        String upperMethod = method.toUpperCase();
        switch (upperMethod) {
            case GET:
            case POST:
            case PUT:
            case PATCH:
            case DELETE:
            case HEAD:
            case OPTIONS:
                return upperMethod;
            default:
                return null;
        }
    }
}
