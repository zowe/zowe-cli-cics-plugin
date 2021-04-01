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

import { AbstractSession, ConnectionPropsForSessCfg, ICommandHandler, IHandlerParameters, IProfile, Session } from "@zowe/imperative";
import { ICMCIApiResponse } from "../api/doc/ICMCIApiResponse";
import { CicsSession } from "./CicsSession";

/**
 * This class is used by the various cics handlers as the base class for their implementation.
 * All handlers should extend this class whenever possible
 */
export abstract class CicsBaseHandler implements ICommandHandler {
    /**
     * This will grab the cics profile and create a session before calling the subclass
     * {@link CicsBaseHandler#processWithSession} method.
     *
     * @param {IHandlerParameters} commandParameters Command parameters sent by imperative.
     *
     * @returns {Promise<void>}
     */
    public async process(commandParameters: IHandlerParameters) {
        const profile = commandParameters.profiles.get("cics", false) || {};
        const session = CicsSession.createBasicCicsSessionFromArguments(commandParameters.arguments);
        const sessCfgWithCreds = await ConnectionPropsForSessCfg.addPropsOrPrompt(session.ISession, commandParameters.arguments);

        const response = await this.processWithSession(commandParameters, new Session(sessCfgWithCreds), profile);

        commandParameters.response.progress.endBar(); // end any progress bars

        // Return as an object when using --response-format-json
        commandParameters.response.data.setObj(response);
    }

    /**
     * This is called by the {@link CicsBaseHandler#process} after it creates a session. Should
     * be used so that every class does not have to instantiate the session object.
     *
     * @param {IHandlerParameters} commandParameters Command parameters sent to the handler.
     * @param {AbstractSession} session The session object generated from the cics profile.
     * @param {IProfile} cicsProfile The cics profile that was loaded for the command.
     *
     * @returns {Promise<ICMCIApiResponse>} The response from the underlying cics api call.
     */
    public abstract async processWithSession(
        commandParameters: IHandlerParameters,
        session: AbstractSession,
        cicsProfile: IProfile
    ): Promise<ICMCIApiResponse>;
}
