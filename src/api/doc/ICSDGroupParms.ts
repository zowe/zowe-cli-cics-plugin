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

export interface ICSDGroupParms {
    /**
     * The name of the CSD Group
     * Up to eight characters long
     */
    name: string;

    /**
     * CSD list name for the CSD Group
     * Up to eight characters long
     */
    csdList: string;

    /**
     * The name of the CICS region of the CSD List
     */
    regionName: string;

    /**
     * CICS Plex of the CSD List
     */
    cicsPlex?: string;
}
