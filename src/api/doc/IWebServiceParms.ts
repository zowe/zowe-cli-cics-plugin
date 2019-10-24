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

export interface IWebServiceParms {
    /**
     * The name of the web service
     * Up to eight characters long
     */
    name: string;

    /**
     * CSD group for the web service
     * Up to eight characters long
     */
    csdGroup: string;

    /**
     * Pipeline name for the web service
     * Up to eight characters long
     */
    pipelineName?: string;

    /**
     * Web service binding file on HFS
     * Should be a fully qualified file name
     */
    wsBind?: string;

    /**
     * Description text for the web service
     */
    description?: string;

    /**
     * Specifies whether full validation of SOAP messages against the
     * corresponding schema in the web service description should be performed
     * at run time
     */
    validation?: boolean;

    /**
     * Web service description file on HFS
     * Should be a fully qualified file name
     */
    wsdlFile?: string;

    /**
     * The name of the CICS region of the web service
     */
    regionName: string;

    /**
     * CICS Plex of the web service
     */
    cicsPlex?: string;
}
