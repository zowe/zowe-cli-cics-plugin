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

// ******* ATTENTION:  LEASE KEEP IN ALPHABETICAL ORDER

export default {
    DEFINE: {
        SUMMARY: "Define new resources to CICS",
        DESCRIPTION: "Define new resources (for example, programs) to CICS through IBM CMCI.",
        RESOURCES: {
            PROGRAM: {
                DESCRIPTION: "Define a new program to CICS.",
                POSITIONALS: {
                    PROGRAMNAME: "The name of the new program to define. The maximum length of the program name is eight characters.",
                    CSDGROUP: "The CICS system definition (CSD) Group for the new program that you want to define." +
                    " The maximum length of the group "
                    + "name is eight characters."
                },
                OPTIONS: {
                    REGIONNAME: "The CICS region name to which to define the new program",
                    CICSPLEX: "The name of the CICSPlex to which to define the new program"
                },
                MESSAGES: {
                    SUCCESS: "The program '%s' was defined successfully."
                },
                EXAMPLES: {
                    EX1: "Define a program named PGM123 to the region name MYREGION in the CSD group MYGRP"
                }
            },
            TRANSACTION: {
                DESCRIPTION: "Define a new transaction to CICS.",
                POSITIONALS: {
                    TRANSACTIONNAME: "The name of the new transaction to define. The maximum length of the transaction name is four characters.",
                    PROGRAMNAME: "The name of the program that the transaction uses. The maximum length of the program name is eight characters.",
                    CSDGROUP: "The CICS system definition (CSD) Group for the new transaction that you want to define." +
                        " The maximum length of the group name is eight characters."
                },
                OPTIONS: {
                    REGIONNAME: "The CICS region name to which to define the new transaction",
                    CICSPLEX: "The name of the CICSPlex to which to define the new transaction"
                },
                MESSAGES: {
                    SUCCESS: "The transaction '%s' was defined successfully."
                },
                EXAMPLES: {
                    EX1: "Define a transaction named TRN1 for the program named PGM123 to the region named MYREGION " +
                        "in the CSD group MYGRP"
                }
            },
            URIMAP: {
                DESCRIPTION: {
                    SERVER: "Define a new URIMAP of type server to CICS. This acts as an HTTP(S) server",
                    CLIENT: "Define a new URIMAP of type client to CICS. This acts as an HTTP(S) client",
                    PIPELINE: "Define a new URIMAP of type pipeline to CICS. This processes incoming HTTP(S) requests"
                },
                POSITIONALS: {
                    URIMAPNAME: "The name of the URIMAP to create. The maximum length of the urimap name is eight characters.",
                    CSDGROUP: "The CICS system definition (CSD) Group for the new urimap that you want to define." +
                        " The maximum length of the group name is eight characters."
                },
                OPTIONS: {
                    URIMAPHOST: "The host component of the URI.",
                    URIMAPPATH: "The path component of the URI.",
                    URIMAPSCHEME: "The scheme component to be used with the request (http or https).",
                    REGIONNAME: "The CICS region name to which to define the new URIMAP.",
                    CICSPLEX: "The name of the CICSPlex to which to define the new URIMAP.",
                    PROGRAMNAME: "The application program that makes or handles the requests.",
                    PIPELINENAME: "The name of the PIPELINE resource definition for the URIMAP. " +
                        "The maximum length of the pipeline name is eight characters.",
                    DESCRIPTION: "Description of the URIMAP resource being defined.",
                    TRANSACTIONNAME: "The name of the TRANSACTION resource definition for the URIMAP. " +
                        "The maximum length of the transaction name is four characters.",
                    WEBSERVICENAME: "The name of the WEBSERVICE resource definition for the URIMAP. " +
                        "The maximum length of the transaction name is 32 characters."
                },
                MESSAGES: {
                    SUCCESS: "The URIMAP '%s' was defined successfully."
                },
                EXAMPLES: {
                    SERVER: {
                        EX1: "Define a URIMAP named URIMAPA for the program named PGM123 to the region named MYREGION " +
                            "in the CSD group MYGRP where the host is www.example.com and the path is /example/index.html"
                    },
                    CLIENT: {
                        EX1: "Define a URIMAP named URIMAPA to the region named MYREGION in the CSD group MYGRP " +
                            "where the host is www.example.com and the path is /example/index.html"
                    },
                    PIPELINE: {
                        EX1: "Define a URIMAP named URIMAPA for the pipeline named PIPE123 to the region named MYREGION " +
                            "in the CSD group MYGRP where the host is www.example.com and the path is /example/index.html"
                    }
                }
            }
        }
    },
    DELETE: {
        SUMMARY: "Delete resources from CICS",
        DESCRIPTION: "Delete resources (for example, programs) from CICS through IBM CMCI.",
        RESOURCES: {
            PROGRAM: {
                DESCRIPTION: "Delete a program from CICS.",
                POSITIONALS: {
                    PROGRAMNAME: "The name of the program to delete. The maximum length of the program name is eight characters.",
                    CSDGROUP: "The CICS system definition (CSD) Group for the program that you want to delete." +
                        " The maximum length of the group name is eight characters."
                },
                OPTIONS: {
                    REGIONNAME: "The CICS region name from which to delete the program",
                    CICSPLEX: "The name of the CICSPlex from which to delete the program"
                },
                MESSAGES: {
                    SUCCESS: "The program '%s' was deleted successfully."
                },
                EXAMPLES: {
                    EX1: "Delete a program named PGM123 from the region named MYREGION"
                }
            },
            TRANSACTION: {
                DESCRIPTION: "Delete a transaction from CICS.",
                POSITIONALS: {
                    TRANSACTIONNAME: "The name of the transaction to delete. The maximum length of the transaction name is four characters.",
                    CSDGROUP: "The CICS system definition (CSD) Group for the transaction that you want to delete." +
                        " The maximum length of the group "
                        + "name is eight characters."
                },
                OPTIONS: {
                    REGIONNAME: "The CICS region name from which to delete the transaction",
                    CICSPLEX: "The name of the CICSPlex from which to delete the transaction"
                },
                MESSAGES: {
                    SUCCESS: "The transaction '%s' was deleted successfully."
                },
                EXAMPLES: {
                    EX1: "Delete a transaction named TRN1 from the region named MYREGION"
                }
            },
            URIMAP: {
                DESCRIPTION: "Delete a urimap from CICS.",
                POSITIONALS: {
                    URIMAPNAME: "The name of the urimap to delete. The maximum length of the urimap name is eight characters.",
                    CSDGROUP: "The CICS system definition (CSD) Group for the urimap that you want to delete." +
                        " The maximum length of the group name is eight characters."
                },
                OPTIONS: {
                    REGIONNAME: "The CICS region name from which to delete the urimap"
                },
                MESSAGES: {
                    SUCCESS: "The urimap '%s' was deleted successfully."
                },
                EXAMPLES: {
                    EX1: "Delete a urimap named URIMAPA from the region named MYREGION belonging to the csdgroup MYGRP"
                }
            }
        }
    },
    DISABLE: {
        SUMMARY: "Disable resources from CICS",
        DESCRIPTION: "Disable resources (for example, urimaps) from CICS through IBM CMCI.",
        RESOURCES: {
            URIMAP: {
                DESCRIPTION: "Disable a urimap from CICS.",
                POSITIONALS: {
                    URIMAPNAME: "The name of the urimap to disable. The maximum length of the urimap name is eight characters.",
                    CSDGROUP: "The CICS system definition (CSD) Group for the new program that you want to disable." +
                    " The maximum length of the group name is eight characters."
                },
                OPTIONS: {
                    REGIONNAME: "The CICS region name in which to disable the urimap"
                },
                MESSAGES: {
                    SUCCESS: "The urimap '%s' was disabled successfully."
                },
                EXAMPLES: {
                    EX1: "Disable a urimap named URIMAPA from the region named MYREGION"
                }
            }
        }
    },
    DISCARD: {
        SUMMARY: "Discard resources from CICS",
        DESCRIPTION: "Discard resources (for example, programs) from CICS through IBM CMCI.",
        RESOURCES: {
            PROGRAM: {
                DESCRIPTION: "Discard a program from CICS.",
                POSITIONALS: {
                    PROGRAMNAME: "The name of the program to discard. The maximum length of the program name is eight characters."
                },
                OPTIONS: {
                    REGIONNAME: "The CICS region name from which to discard the program",
                    CICSPLEX: "The name of the CICSPlex from which to discard the program"
                },
                MESSAGES: {
                    SUCCESS: "The program '%s' was discarded successfully."
                },
                EXAMPLES: {
                    EX1: "Discard a program named PGM123 from the region named MYREGION"
                }
            },
            TRANSACTION: {
                DESCRIPTION: "Discard a transaction from CICS.",
                POSITIONALS: {
                    TRANSACTIONNAME: "The name of the transaction to discard. The maximum length of the transaction name is four characters."
                },
                OPTIONS: {
                    REGIONNAME: "The CICS region name from which to discard the transaction",
                    CICSPLEX: "The name of the CICSPlex from which to discard the transaction"
                },
                MESSAGES: {
                    SUCCESS: "The transaction '%s' was discarded successfully."
                },
                EXAMPLES: {
                    EX1: "Discard a transaction named TRN1 from the region named MYREGION"
                }
            }
        }
    },
    ENABLE: {
        SUMMARY: "Enable resources from CICS",
        DESCRIPTION: "Enable resources (for example, urimaps) from CICS through IBM CMCI.",
        RESOURCES: {
            URIMAP: {
                DESCRIPTION: "Enable a urimap from CICS.",
                POSITIONALS: {
                    URIMAPNAME: "The name of the urimap to enable. The maximum length of the urimap name is eight characters.",
                    CSDGROUP: "The CICS system definition (CSD) Group for the new program that you want to disable." +
                    " The maximum length of the group name is eight characters."
                },
                OPTIONS: {
                    REGIONNAME: "The CICS region name in which to enable the urimap"
                },
                MESSAGES: {
                    SUCCESS: "The urimap '%s' was enabled successfully."
                },
                EXAMPLES: {
                    EX1: "Enable a urimap named URIMAPA from the region named MYREGION"
                }
            }
        }
    },
    GET: {
        SUMMARY: "Get resources from CICS",
        DESCRIPTION: "Get resources (for example, programs or transactions) from CICS through IBM CMCI.",
        RESOURCES: {
            RESOURCE: {
                DESCRIPTION: "Get resources (for example, programs or transactions) from CICS.",
                POSITIONALS: {
                    RESOURCENAME: "The name of the resource to get.",
                },
                OPTIONS: {
                    REGIONNAME: "The CICS region name from which to get the resources",
                    CICSPLEX: "The name of the CICSPlex from which to get the resources",
                    CRITERIA: "The criteria by which to filter the resource",
                    PARAMETER: "The parameter by which to refine the resource"
                },
                MESSAGES: {
                    SUCCESS: "The resource(s) for '%s' were retrieved successfully."
                },
                EXAMPLES: {
                    EX1: "Get program resources from the region named MYREGION",
                    EX2: "Get local transaction resources from the region named MYREGION",
                    EX3: "Get local file resources from the region named MYREGION",
                    EX4: "Get program definition resources from the CSD group named GRP1 and the region named MYREGION",
                    EX5: "Get transaction definition resources from the CSD group named GRP1 and the region named MYREGION",
                    EX6: "Get URIMap definition resources from the CSD group named GRP1 and the region named MYREGION",
                    EX7: "Get program resources that start with the name PRG from the region named MYREGION",
                    EX8: "Get a local transaction resource named TRAN from the region named MYREGION",
                    EX9: "Get program resources that start with the name MYPRG from the region named MYREGION and display various fields as a table",
                }
            }
        }
    },
    INSTALL: {
        SUMMARY: "Install resources to CICS",
        DESCRIPTION: "Install resources (for example, programs) to CICS through IBM CMCI.",
        RESOURCES: {
            PROGRAM: {
                DESCRIPTION: "Install a program to CICS.",
                POSITIONALS: {
                    PROGRAMNAME: "The name of the program to install. The maximum length of the program name is eight characters.",
                    CSDGROUP: "The CICS system definition (CSD) Group for the program that you want to install." +
                        " The maximum length of the group name is eight characters."
                },
                OPTIONS: {
                    REGIONNAME: "The CICS region name to which to install the program",
                    CICSPLEX: "The name of the CICSPlex to which to install the program"
                },
                MESSAGES: {
                    SUCCESS: "The program named '%s' was installed successfully."
                },
                EXAMPLES: {
                    EX1: "Install a program named PGM123 to the region named MYREGION in the CSD group MYGRP"
                }
            },
            TRANSACTION: {
                DESCRIPTION: "Install a transaction to CICS.",
                POSITIONALS: {
                    TRANSACTIONNAME: "The name of the transaction to install. The maximum length of the transaction name is four characters.",
                    CSDGROUP: "The CICS system definition (CSD) Group for the transaction that you want to install." +
                        " The maximum length of the group name is eight characters."
                },
                OPTIONS: {
                    REGIONNAME: "The CICS region name to which to install the transaction",
                    CICSPLEX: "The name of the CICSPlex to which to install the transaction"
                },
                MESSAGES: {
                    SUCCESS: "The transaction '%s' was installed successfully."
                },
                EXAMPLES: {
                    EX1: "Install a transaction named TRN1 to the region named MYREGION " +
                        "in the CSD group MYGRP",
                }
            }
        }
    },
    REFRESH: {
        SUMMARY: "Refresh program on CICS",
        DESCRIPTION: "Refresh a program on CICS through IBM CMCI.",
        RESOURCES: {
            PROGRAM: {
                DESCRIPTION: "Refresh a program on CICS.",
                POSITIONALS: {
                    PROGRAMNAME: "The name of the program to refresh. The maximum length of the program name is eight characters."
                },
                OPTIONS: {
                    REGIONNAME: "The CICS region name on which you want to refresh the program",
                    CICSPLEX: "The name of the CICSPlex on which to refresh the program"
                },
                MESSAGES: {
                    SUCCESS: "The program '%s' was refreshed successfully."
                },
                EXAMPLES: {
                    DEFINE_EXAMPLE_ONE: "Refresh a program named PGM123 from the region named MYREGION"
                }
            }
        }
    }
};
