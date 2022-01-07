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

import { AbstractSession, IHandlerParameters, IProfile, RestClient, TextUtils } from "@zowe/imperative";
import { CicsBaseHandler } from "../../CicsBaseHandler";

/**
 * Handler to show zosmf information
 * @export
 * @class Handler
 * @implements {ICommandHandler}
 */
export default class Handler extends CicsBaseHandler {
    public async processWithSession(params: IHandlerParameters, session: AbstractSession, profile: IProfile): Promise<any> {
        params.response.console.log("\n\nTest message: LOGOUT from CICS\n");
        const zosResponse: any = await RestClient.getExpectJSON(session, "/zosmf/info", [{ "X-CSRF-ZOSMF-HEADER": true }]);
        params.response.console.log(TextUtils.prettyJson(zosResponse));
    }
}
