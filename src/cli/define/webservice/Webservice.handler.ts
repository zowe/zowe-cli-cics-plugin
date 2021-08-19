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

import { AbstractSession, IHandlerParameters, IProfile, ITaskWithStatus, TaskStage } from "@zowe/imperative";
import { ICMCIApiResponse, defineWebservice } from "../../../api";
import { CicsBaseHandler } from "../../CicsBaseHandler";

import i18nTypings from "../../-strings-/en";

// Does not use the import in anticipation of some internationalization work to be done later.
const strings = (require("../../-strings-/en").default as typeof i18nTypings).DEFINE.RESOURCES.WEBSERVICE;

/**
 * Command handler for defining CICS transactions via CMCI
 * @export
 * @class TransactionHandler
 * @implements {ICommandHandler}
 */
export default class WebServiceHandler extends CicsBaseHandler {
    public async processWithSession(params: IHandlerParameters, session: AbstractSession, profile: IProfile): Promise<ICMCIApiResponse> {

        const status: ITaskWithStatus = {
            statusMessage: "Defining web service to CICS",
            percentComplete: 0,
            stageName: TaskStage.IN_PROGRESS
        };
        params.response.progress.startBar({task: status});

        /*
        * Git Bash on Windows attempts to replace forward slashes with a
        * directory path (e.g., /u -> U:/). CICS is picky when it validates the
        * wsbind path. Unlike typical Unix paths, it must start with one slash
        * and two are not allowed. We need to support paths prefixed with two
        * slashes so Git Bash does not tamper with them, and then strip off the
        * extra leading slash here so CICS validation will not complain.
        */
        let wsBind: string = params.arguments.wsbind;
        if (wsBind.startsWith("//")) {
            wsBind = wsBind.slice(1);
        }

        const response = await defineWebservice(session, {
            name: params.arguments.webserviceName,
            csdGroup: params.arguments.csdGroup,
            pipelineName: params.arguments.pipelineName,
            wsBind,
            description: params.arguments.description,
            validation: params.arguments.validation,
            wsdlFile: params.arguments.wsdlFile,
            regionName: params.arguments.regionName || profile.regionName,
            cicsPlex: params.arguments.cicsPlex || profile.cicsPlex
        });

        params.response.console.log(strings.MESSAGES.SUCCESS, params.arguments.webserviceName);
        return response;
    }
}
