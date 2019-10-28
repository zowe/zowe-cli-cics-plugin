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
import { CicsSession } from "../CicsSession";

import { ProgramDefinition } from "./program/Program.definition";
import { TransactionDefinition } from "./transaction/Transaction.definition";
import { UrimapServerDefinition } from "./urimap-server/UrimapServer.definition";
import { UrimapClientDefinition } from "./urimap-client/UrimapClient.definition";
import { UrimapPipelineDefinition } from "./urimap-pipeline/UrimapPipeline.definition";
import { WebServiceDefinition } from "./webservice/Webservice.definition";

import i18nTypings from "../-strings-/en";

// Does not use the import in anticipation of some internationalization work to be done later.
const strings = (require("../-strings-/en").default as typeof i18nTypings).DEFINE;

/**
 * Definition for the "define" group of commands under the CICS plugin
 */
const definition: ICommandDefinition = {
    name: "define", aliases: ["def"],
    summary: strings.SUMMARY,
    description: strings.DESCRIPTION,
    type: "group",
    children: [ProgramDefinition,
               TransactionDefinition,
               UrimapServerDefinition,
               UrimapClientDefinition,
               UrimapPipelineDefinition,
               WebServiceDefinition],
    passOn: [
        {
            property: "options",
            value: CicsSession.CICS_CONNECTION_OPTIONS,
            merge: true,
            ignoreNodes: [
                {type: "group"}
            ]
        }
    ]
};
export = definition;
