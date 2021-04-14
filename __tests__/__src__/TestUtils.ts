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
 *
 * @param {number} length - how long should the string be
 * @param {boolean} upToLength -  if true, length is the maximum length of the string.
 *                               (generate a string 'up to' length characters long)
 * @returns {string} the random string
 */
export function generateRandomAlphaNumericString(length: number, upToLength: boolean = false): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    if (upToLength) {
        length = Math.floor(Math.random() * length) + 1;
    }
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
