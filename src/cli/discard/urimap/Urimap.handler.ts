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
import { ICMCIApiResponse, discardUrimap } from "../../../api";
import { CicsBaseHandler } from "../../CicsBaseHandler";

import i18nTypings from "../../-strings-/en";

// Does not use the import in anticipation of some internationalization work to be done later.
const strings = (require("../../-strings-/en").default as typeof i18nTypings).DISCARD.RESOURCES.URIMAP;

/**
 * Command handler for discarding CICS URIMaps via CMCI
 * @export
 * @class UrimapHandler
 * @implements {ICommandHandler}
 */

export default class UrimapHandler extends CicsBaseHandler {
    public async processWithSession(params: IHandlerParameters, session: AbstractSession, profile: IProfile): Promise<ICMCIApiResponse> {

        const status: ITaskWithStatus = {
            statusMessage: "Discarding URIMAP from CICS",
            percentComplete: 0,
            stageName: TaskStage.IN_PROGRESS
        };
        params.response.progress.startBar({task: status});

        const response = await discardUrimap(session, {
            name: params.arguments.urimapName,
            regionName: params.arguments.regionName || profile.regionName
        });

        params.response.console.log(strings.MESSAGES.SUCCESS, params.arguments.urimapName);
        return response;
    }
}
