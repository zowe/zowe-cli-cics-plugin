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

export default {
    DEFINE: {
        SUMMARY: "Definir nuevos recursos en CICS a través de IBM CMCI",
        DESCRIPTION: "Definir nuevos recursos (por ejemplo, programas) en CICS a través de CMCI.",
        RESOURCES: {
            PROGRAM: {
                DESCRIPTION: "Definir un nuevo programa en CICS a través de CMCI",
                POSITIONALS: {
                    PROGRAMNAME: "El nombre the programa que desea definir. La longitud máxima del nombre es de ocho caracteres",
                    CSDGROUP: "El nombre del grupo CSD del programa que desea definir. La longitud máxima del nombre del grupo es de ocho caracteres"
                },
                OPTIONS: {
                    REGIONNAME: "Nombre de la región CICS a la cual desea definir el programa.",
                    CICSPLEX: "Nombre del CICS Plex al cual desea definir el programa."
                },
                MESSAGES: {
                    SUCCESS: "La definición del programa '%s' fue exitosa."
                }
            }
        }
    }
};
