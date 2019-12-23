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
 * Interface representing the values in the custom_properties.yaml file
 * see example_properties.yaml for descriptions and more details
 */
export interface ITestPropertiesSchema {

    /**
     * Properties related to connecting to CMCI
     */
    cmci: {
        /**
         * user ID to connect to CMCI
         */
        user: string,
        /**
         * Password to connect to CMCI
         */
        password: string,
        /**
         * host name for  CMCI
         */
        host: string,
        /**
         * Port for CMCI
         */
        port?: number,
        /**
         * CSD group to define resources to
         */
        csdGroup?: string;

        /**
         * Name of the CICS region e.g. "CICSCMCI"
         */
        regionName?: string;

        /**
         * http or https protocol for CMCI
         */
        protocol?: string;

        /**
         * http or https protocol for CMCI
         */
        rejectUnauthorized?: boolean;
    };

    urimap: {
        /**
         * Name of the certificate to use for CICS Client Testing
         */
        certificate?: string;
    };
}
