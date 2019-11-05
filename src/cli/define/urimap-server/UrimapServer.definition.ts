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

import { ICommandDefinition } from "@zowe/imperative";

import i18nTypings from "../../-strings-/en";

// Does not use the import in anticipation of some internationalization work to be done later.
const strings = (require("../../-strings-/en").default as typeof i18nTypings).DEFINE.RESOURCES.URIMAP;

export const UrimapServerDefinition: ICommandDefinition = {
    name: "urimap-server",
    aliases: ["us"],
    description: strings.DESCRIPTION.SERVER,
    handler: __dirname + "/UrimapServer.handler",
    type: "command",
    positionals: [{
        name: "urimapName",
        description: strings.POSITIONALS.URIMAPNAME,
        type: "string",
        required: true
    }, {
        name: "csdGroup",
        description: strings.POSITIONALS.CSDGROUP,
        type: "string",
        required: true
    }],
    options: [
        {
            name: "urimap-path",
            aliases: ["up"],
            description: strings.OPTIONS.URIMAPPATH,
            type: "string",
            required: true
        },
        {
            name: "urimap-host",
            aliases: ["uh"],
            description: strings.OPTIONS.URIMAPHOST,
            type: "string",
            required: true
        },
        {
            name: "urimap-scheme",
            aliases: ["us"],
            description: strings.OPTIONS.URIMAPSCHEME,
            type: "string",
            allowableValues: {values: ["http", "https"], caseSensitive: false},
            defaultValue: "http"
        },
        {
            name: "program-name",
            aliases: ["pn"],
            description: strings.OPTIONS.PROGRAMNAME,
            type: "string",
            required: true
        },
        {
            name: "description",
            aliases: ["desc"],
            description: strings.OPTIONS.DESCRIPTION,
            type: "string"
        },
        {
            name: "region-name",
            description: strings.OPTIONS.REGIONNAME,
            type: "string",
        },
        {
            name: "cics-plex",
            description: strings.OPTIONS.CICSPLEX,
            type: "string"
        },
        {
            name: "enable",
            description: strings.OPTIONS.ENABLE,
            type: "boolean",
            defaultValue: true
        }],
    profile: {optional: ["cics"]},
    examples: [{
        description: strings.EXAMPLES.SERVER.EX1,
        options: "URIMAPA MYGRP --urimap-path /example/index.html --urimap-host www.example.com --program-name PGM123 --region-name MYREGION"
    }]
};
