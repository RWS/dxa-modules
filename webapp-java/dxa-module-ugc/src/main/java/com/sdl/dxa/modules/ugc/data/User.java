package com.sdl.dxa.modules.ugc.data;

import lombok.Data;

/**
 * <p>Ugc User information</p>
 */
@Data
public class User {
    private String id;

    private String name;

    private String emailAddress;

    private String externalId;
}
