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

import { AbstractSession, ICommandHandler, IHandlerParameters, IProfile, ITaskWithStatus, TaskStage } from "@zowe/imperative";
import { ICMCIApiResponse, defineUrimapPipeline } from "../../../api";
import { CicsBaseHandler } from "../../CicsBaseHandler";

import i18nTypings from "../../-strings-/en";

// Does not use the import in anticipation of some internationalization work to be done later.
const strings = (require("../../-strings-/en").default as typeof i18nTypings).DEFINE.RESOURCES.URIMAP;

/**
 * Command handler for defining CICS URIMaps via CMCI
 * @export
 * @class UrimapPipelineHandler
 * @implements {ICommandHandler}
 */
export default class UrimapPipelineHandler extends CicsBaseHandler {
    public async processWithSession(params: IHandlerParameters, session: AbstractSession, profile: IProfile): Promise<ICMCIApiResponse> {

        const status: ITaskWithStatus = {
            statusMessage: "Defining URIMAP of type Pipeline to CICS",
            percentComplete: 0,
            stageName: TaskStage.IN_PROGRESS
        };
        params.response.progress.startBar({task: status});

        const response = await defineUrimapPipeline(session, {
            name: params.arguments.urimapName,
            csdGroup: params.arguments.csdGroup,
            path: params.arguments.urimapPath,
            host: params.arguments.urimapHost,
            pipelineName: params.arguments.pipelineName,
            scheme: params.arguments.urimapScheme,
            description: params.arguments.description,
            enable: params.arguments.enable,
            transactionName: params.arguments.transactionName,
            webserviceName: params.arguments.webserviceName,
            regionName: params.arguments.regionName || profile.regionName,
            cicsPlex: params.arguments.cicsPlex || profile.cicsPlex
        });

        params.response.console.log(strings.MESSAGES.SUCCESS, params.arguments.urimapName);
        return response;
    }
}
