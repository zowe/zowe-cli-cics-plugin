/*
* This program and the accompanying materials are made available under the terms of the *
* Eclipse Public License v2.0 which accompanies this distribution, and is available at *
* https://www.eclipse.org/legal/epl-v20.html                                      *
*                                                                                 *
* SPDX-License-Identifier: EPL-2.0                                                *
*                                                                                 *
* Copyright Contributors to the Zowe Project.                                     *
*                                                                                 *
*/

import { ICommandArguments, ICommandOptionDefinition, IProfile, Logger, Session } from "@zowe/imperative";

/**
 * Utility Methods for Brightside
 * @export
 */
export class CicsSession {

    public static CICS_CONNECTION_OPTION_GROUP = "Cics Connection Options";

    /**
     * Option used in profile creation and commands for hostname for CICS
     */
    public static CICS_OPTION_HOST: ICommandOptionDefinition = {
        name: "host",
        aliases: ["H"],
        description: "The CICS server host name.",
        type: "string",
        required: true,
        group: CicsSession.CICS_CONNECTION_OPTION_GROUP
    };

    /**
     * Option used in profile creation and commands for port for CICS
     */
    public static CICS_OPTION_PORT: ICommandOptionDefinition = {
        name: "port",
        aliases: ["P"],
        description: "The CICS server port.",
        type: "number",
        defaultValue: 443,
        group: CicsSession.CICS_CONNECTION_OPTION_GROUP
    };

    /**
     * Option used in profile creation and commands for username / ID  for CICS
     */
    public static CICS_OPTION_USER: ICommandOptionDefinition = {
        name: "user",
        aliases: ["u"],
        description: "Mainframe (CICS) user name, which can be the same as your TSO login.",
        type: "string",
        required: true,
        group: CicsSession.CICS_CONNECTION_OPTION_GROUP
    };

    /**
     * Option used in profile creation and commands for password/passphrase for CICS
     */
    public static CICS_OPTION_PASSWORD: ICommandOptionDefinition = {
        name: "password",
        aliases: ["pw"],
        description: "Mainframe (CICS) password, which can be the same as your TSO password.",
        type: "string",
        group: CicsSession.CICS_CONNECTION_OPTION_GROUP,
        required: true
    };
    /**
     * Option used in profile creation and commands for rejectUnauthorized setting for connecting to FMP
     */
    public static CICS_OPTION_REJECT_UNAUTHORIZED: ICommandOptionDefinition = {
        name: "reject-unauthorized",
        aliases: ["ru"],
        description: "Reject self-signed certificates.",
        type: "boolean",
        defaultValue: true,
        required: false,
        group: CicsSession.CICS_CONNECTION_OPTION_GROUP
    };
    /**
     * Option used in profile creation and commands for protocol for CMCI
     */
    public static CICS_OPTION_PROTOCOL: ICommandOptionDefinition = {
        name: "protocol",
        aliases: ["o"],
        description: "Specifies CMCI protocol (http or https).",
        type: "string",
        defaultValue: "http",
        required: true,
        allowableValues: {values: ["http", "https"], caseSensitive: false},
        group: CicsSession.CICS_CONNECTION_OPTION_GROUP
    };

    /**
     * Options related to connecting to CICS
     * These options can be filled in if the user creates a profile
     */
    public static CICS_CONNECTION_OPTIONS: ICommandOptionDefinition[] = [
        CicsSession.CICS_OPTION_HOST,
        CicsSession.CICS_OPTION_PORT,
        CicsSession.CICS_OPTION_USER,
        CicsSession.CICS_OPTION_PASSWORD,
        CicsSession.CICS_OPTION_REJECT_UNAUTHORIZED,
        CicsSession.CICS_OPTION_PROTOCOL
    ];

    /**
     * Given a CICS profile, create a REST Client Session.
     * @static
     * @param {IProfile} profile - The CICS profile contents
     * @returns {Session} - A session for usage in the CMCI REST Client
     */
    public static createBasicCicsSession(profile: IProfile): Session {
        this.log.debug("Creating a CICS session from the profile named %s", profile.name);
        return new Session({
            type: "basic",
            hostname: profile.host,
            port: profile.port,
            user: profile.user,
            password: profile.pass,
            basePath: profile.basePath,
            protocol: profile.protocol || "http",
        });
    }

    /**
     * Given command line arguments, create a REST Client Session.
     * @static
     * @param {IProfile} args - The arguments specified by the user
     * @returns {Session} - A session for usage in the CMCI REST Client
     */
    public static createBasicCicsSessionFromArguments(args: ICommandArguments): Session {
        this.log.debug("Creating a CICS session from arguments");
        return new Session({
            type: "basic",
            hostname: args.host,
            port: args.port,
            user: args.user,
            password: args.password,
            basePath: args.basePath,
            rejectUnauthorized: args.rejectUnauthorized,
            protocol: args.protocol || "http",
        });
    }


    private static get log(): Logger {
        return Logger.getAppLogger();
    }
}
