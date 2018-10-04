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
 * Interface representing API response from CMCI's web interface, parsed from XML to a javascript object
 * using the xml2js package.
 */
import { ICMCIResponseResultSummary } from "./ICMCIResponseResultSummary";

export interface ICMCIApiResponse {
    /**
     * See the following link for more information:
     * https://www.ibm.com/support/knowledgecenter/SSGMCP_5.2.0/com.ibm.cics.ts.clientapi.doc/topics/clientapi_response_element.html
     */
    response: {
        /**
         * See the following link for more information:
         * https://www.ibm.com/support/knowledgecenter/SSGMCP_5.2.0/com.ibm.cics.ts.clientapi.doc/topics/clientapi_resultsummary_element.html
         */
        resultsummary: ICMCIResponseResultSummary;
        /**
         * See the following link for more information:
         * https://www.ibm.com/support/knowledgecenter/SSGMCP_5.2.0/com.ibm.cics.ts.clientapi.doc/topics/clientapi_records_element.html
         */
        records: any;
    };
}
