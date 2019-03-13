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

import { IMessageDefinition } from "@zowe/imperative";

/**
 * Messages for the CICS plugin
 */
export const CicsCmciMessages: { [key: string]: IMessageDefinition } = {

    cmciRequestFailed: {
        message: "Did not receive the expected response from CMCI REST API. "
    }
};
