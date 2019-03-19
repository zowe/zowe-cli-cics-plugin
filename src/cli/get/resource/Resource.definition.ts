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
const strings = (require("../../-strings-/en").default as typeof i18nTypings).GET.RESOURCES.RESOURCE;

export const ResourceDefinition: ICommandDefinition = {
    name: "resource", aliases: ["res"],
    description: strings.DESCRIPTION,
    handler: __dirname + "/Resource.handler",
    type: "command",
    positionals: [{
        name: "resourceName",
        description: strings.POSITIONALS.RESOURCENAME,
        type: "string",
        required: true
    }],
    outputFormatOptions: true,
    options: [
        {
            name: "region-name", aliases: ["rn"],
            description: strings.OPTIONS.REGIONNAME,
            type: "string"
        },
        {
            name: "cics-plex", aliases:["cp"],
            description: strings.OPTIONS.CICSPLEX,
            type: "string"
        },
        {
            name: "criteria", aliases: ["c"],
            description: strings.OPTIONS.CRITERIA,
            type: "string"
        },
        {
            name: "parameter", aliases: ["p"],
            description: strings.OPTIONS.PARAMETER,
            type: "string"
        }],

    profile: {optional: ["cics"]},
    examples: [
        {
            description: strings.EXAMPLES.EX1,
            options: "CICSProgram --region-name MYREGION"
        },
        {
            description: strings.EXAMPLES.EX2,
            options: "CICSLocalTransaction --region-name MYREGION"
        },
        {
            description: strings.EXAMPLES.EX3,
            options: "CICSLocalFile --region-name MYREGION"
        },
        {
            description: strings.EXAMPLES.EX4,
            options: `CICSDefinitionProgram --region-name MYREGION --parameter "CSDGROUP(GRP1)"`
        },
        {
            description: strings.EXAMPLES.EX5,
            options: `CICSDefinitionTransaction --region-name MYREGION --parameter "CSDGROUP(GRP1)"`
        },
        {
            description: strings.EXAMPLES.EX6,
            options: `CICSProgram --region-name MYREGION --criteria "PROGRAM=PRG*"`
        },
        {
            description: strings.EXAMPLES.EX7,
            options: `CICSLocalTransaction --region-name MYREGION --criteria "TRANID=TRAN"`
        },
        {
            description: strings.EXAMPLES.EX8,
            options: `CICSProgram --region-name MYREGION --criteria "PROGRAM=MYPRG*" --rft table --rfh --rff program length status`
        }
    ]
};

// These are GET REST API options available (for future)
// options: [
//     ResourceOptions.count,
//     ResourceOptions.orderby,
//     ResourceOptions.descending,
//     ResourceOptions.nodiscard,
//     ResourceOptions.summonly,
//     ResourceOptions.showApiResponse
// ]
