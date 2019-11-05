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

/**
 * Constants to be used by the API
 */
export const CicsCmciConstants: { [key: string]: any } = {
    /**
     * Specifies the required part of the REST interface URI
     */
    CICS_SYSTEM_MANAGEMENT: "CICSSystemManagement",

    /**
     * Specifies the required part of the REST interface URI to access program definitions
     */
    CICS_DEFINITION_PROGRAM: "CICSDefinitionProgram",

    /**
     * Specifies the required part of the REST interface URI to update installed transactions
     */
    CICS_LOCAL_TRANSACTION: "CICSLocalTransaction",

    /**
     * Specifies the required part of the REST interface URI to access transaction definitions
     */
    CICS_DEFINITION_TRANSACTION: "CICSDefinitionTransaction",

    /**
     * Specifies the required part of the REST interface URI to access program resources
     */
    CICS_PROGRAM_RESOURCE: "CICSProgram",

    /**
     * Specifies the required part of the REST interface URI to access URIMap definitions
     */
    CICS_DEFINITION_URIMAP: "CICSDefinitionURIMap",

    /**
     * Specifies the required part of the REST interface URI to access webservice definitions
     */
    CICS_DEFINITION_WEBSERVICE: "CICSDefinitionWebService",

    /*
     * Specifies the required part of the REST interface URI to access URIMaps
     */
    CICS_URIMAP: "CICSURIMap",

    /**
     * Specifies the required part of the REST interface URI to access CSD Group definitions
     */

    CICS_CSDGROUP: "CICSCSDGroup",

    /**
     * ORDERBY parameter
     */
    ORDER_BY: "ORDERBY",

    /**
     * SUMMONLY parameter
     */
    SUMM_ONLY: "SUMMONLY",

    /**
     * NODISCARD parameter
     */
    NO_DISCARD: "NODISCARD",

    /**
     * CRITERIA parameter
     */
    CRITERIA: "CRITERIA",

    /**
     * PARAMETER parameter
     */
    PARAMETER: "PARAMETER",

    /**
     * The CICS CMCI external resource names
     */
    CICS_CMCI_EXTERNAL_RESOURCES: ["CICSLocalTransaction", "CICSRemoteTransaction", "CICSDefinitionTransaction", "CICSLocalFile"],

};
