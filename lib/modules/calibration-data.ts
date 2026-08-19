import type { ModuleModeCalibration } from "@/lib/modules/calibration"
import type { ModuleSlug } from "@/lib/modules/types"
import type { QuizMode } from "@/lib/types"

export const MODULE_CALIBRATIONS = {
  "security": {
    "standard": {
      "headline": {
        "activism": {
          "mean": 4.296999999999998,
          "sd": 0.3096975944368957,
          "attainable": {
            "minimum": 3.17,
            "maximum": 5.54
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.1667000000000005
            },
            "upper": {
              "percentile": 0.67,
              "raw": 4.43
            }
          }
        },
        "escalation": {
          "mean": 4.326620000000001,
          "sd": 0.29868909521440506,
          "attainable": {
            "minimum": 3.44,
            "maximum": 5.32
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.18
            },
            "upper": {
              "percentile": 0.67,
              "raw": 4.48
            }
          }
        },
        "alliance": {
          "mean": 4.252159999999997,
          "sd": 0.23969174871071397,
          "attainable": {
            "minimum": 3.61,
            "maximum": 4.86
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.14
            },
            "upper": {
              "percentile": 0.67,
              "raw": 4.36
            }
          }
        },
        "legitimacy": {
          "mean": 4.405280000000001,
          "sd": 0.2826321312236102,
          "attainable": {
            "minimum": 3.43,
            "maximum": 5.12
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.29
            },
            "upper": {
              "percentile": 0.67,
              "raw": 4.53
            }
          }
        }
      },
      "lanes": {
        "deterrence": {
          "activism": {
            "mean": 4.457740000000008,
            "sd": 0.5367814195741131,
            "attainable": {
              "minimum": 3.08,
              "maximum": 5.92
            },
            "cuts": {
              "lower": {
                "percentile": 0.33,
                "raw": 4.22
              },
              "upper": {
                "percentile": 0.67,
                "raw": 4.7
              }
            }
          },
          "escalation": {
            "mean": 4.469400000000003,
            "sd": 0.5999146939357295,
            "attainable": {
              "minimum": 3.17,
              "maximum": 5.97
            },
            "cuts": {
              "lower": {
                "percentile": 0.33,
                "raw": 4.13
              },
              "upper": {
                "percentile": 0.67,
                "raw": 4.75
              }
            }
          }
        },
        "alliances": {
          "alliance": {
            "mean": 4.640899999999998,
            "sd": 0.8730018270313069,
            "attainable": {
              "minimum": 2.9,
              "maximum": 6.25
            },
            "cuts": {
              "lower": {
                "percentile": 0.33,
                "raw": 4.4
              },
              "upper": {
                "percentile": 0.67,
                "raw": 4.95
              }
            }
          }
        },
        "legitimacy": {
          "legitimacy": {
            "mean": 4.770500000000005,
            "sd": 0.6525386961705791,
            "attainable": {
              "minimum": 2.93,
              "maximum": 6
            },
            "cuts": {
              "lower": {
                "percentile": 0.33,
                "raw": 4.5
              },
              "upper": {
                "percentile": 0.67,
                "raw": 5.13
              }
            }
          }
        }
      }
    },
    "analyst": {
      "headline": {
        "activism": {
          "mean": 4.284900000000004,
          "sd": 0.22537477676084322,
          "attainable": {
            "minimum": 3.32,
            "maximum": 5.4
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.1867
            },
            "upper": {
              "percentile": 0.67,
              "raw": 4.38
            }
          }
        },
        "escalation": {
          "mean": 4.303600000000005,
          "sd": 0.22133558231789122,
          "attainable": {
            "minimum": 3.53,
            "maximum": 5.22
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.19
            },
            "upper": {
              "percentile": 0.67,
              "raw": 4.41
            }
          }
        },
        "alliance": {
          "mean": 4.325579999999999,
          "sd": 0.2454169179172453,
          "attainable": {
            "minimum": 3.44,
            "maximum": 5.18
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.22
            },
            "upper": {
              "percentile": 0.67,
              "raw": 4.45
            }
          }
        },
        "legitimacy": {
          "mean": 4.441580000000001,
          "sd": 0.23070869857896584,
          "attainable": {
            "minimum": 3.45,
            "maximum": 5.11
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.3367
            },
            "upper": {
              "percentile": 0.67,
              "raw": 4.56
            }
          }
        }
      },
      "lanes": {
        "deterrence": {
          "activism": {
            "mean": 4.402640000000003,
            "sd": 0.5475007126936001,
            "attainable": {
              "minimum": 3.08,
              "maximum": 5.92
            },
            "cuts": {
              "lower": {
                "percentile": 0.33,
                "raw": 4.13
              },
              "upper": {
                "percentile": 0.67,
                "raw": 4.6366000000000005
              }
            }
          },
          "escalation": {
            "mean": 4.4117400000000035,
            "sd": 0.5977129515076616,
            "attainable": {
              "minimum": 3.17,
              "maximum": 5.97
            },
            "cuts": {
              "lower": {
                "percentile": 0.33,
                "raw": 4.0934
              },
              "upper": {
                "percentile": 0.67,
                "raw": 4.7
              }
            }
          }
        },
        "alliances": {
          "alliance": {
            "mean": 4.602980000000001,
            "sd": 0.635241150745132,
            "attainable": {
              "minimum": 3.02,
              "maximum": 6.25
            },
            "cuts": {
              "lower": {
                "percentile": 0.33,
                "raw": 4.3
              },
              "upper": {
                "percentile": 0.67,
                "raw": 4.85
              }
            }
          }
        },
        "legitimacy": {
          "legitimacy": {
            "mean": 4.858999999999997,
            "sd": 0.5362475174767711,
            "attainable": {
              "minimum": 2.94,
              "maximum": 6.06
            },
            "cuts": {
              "lower": {
                "percentile": 0.33,
                "raw": 4.62
              },
              "upper": {
                "percentile": 0.67,
                "raw": 5.12
              }
            }
          }
        }
      }
    }
  },
  "technology": {
    "standard": {
      "headline": {
        "control": {
          "mean": 4.527220000000005,
          "sd": 0.36555118875473525,
          "attainable": {
            "minimum": 3.16,
            "maximum": 5.69
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.36
            },
            "upper": {
              "percentile": 0.67,
              "raw": 4.74
            }
          }
        },
        "governance": {
          "mean": 4.563380000000002,
          "sd": 0.31755247692310645,
          "attainable": {
            "minimum": 3.42,
            "maximum": 5.78
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.4167000000000005
            },
            "upper": {
              "percentile": 0.67,
              "raw": 4.71
            }
          }
        },
        "industrial": {
          "mean": 4.455440000000005,
          "sd": 0.3006373336763081,
          "attainable": {
            "minimum": 3.5,
            "maximum": 5.06
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.35
            },
            "upper": {
              "percentile": 0.67,
              "raw": 4.6
            }
          }
        },
        "safety": {
          "mean": 4.567519999999997,
          "sd": 0.2877044483493435,
          "attainable": {
            "minimum": 3.66,
            "maximum": 5.33
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.44
            },
            "upper": {
              "percentile": 0.67,
              "raw": 4.7
            }
          }
        }
      },
      "lanes": {
        "controls": {
          "control": {
            "mean": 4.577200000000009,
            "sd": 0.6917012071696856,
            "attainable": {
              "minimum": 2.9,
              "maximum": 6.1
            },
            "cuts": {
              "lower": {
                "percentile": 0.33,
                "raw": 4.3
              },
              "upper": {
                "percentile": 0.67,
                "raw": 4.93
              }
            }
          }
        },
        "capacity": {
          "industrial": {
            "mean": 4.9633400000000005,
            "sd": 0.7072254551414283,
            "attainable": {
              "minimum": 3.03,
              "maximum": 6.23
            },
            "cuts": {
              "lower": {
                "percentile": 0.33,
                "raw": 4.67
              },
              "upper": {
                "percentile": 0.67,
                "raw": 5.33
              }
            }
          }
        },
        "governance": {
          "governance": {
            "mean": 4.693800000000004,
            "sd": 0.719202030030505,
            "attainable": {
              "minimum": 3.4,
              "maximum": 6.2
            },
            "cuts": {
              "lower": {
                "percentile": 0.33,
                "raw": 4.4
              },
              "upper": {
                "percentile": 0.67,
                "raw": 5
              }
            }
          },
          "safety": {
            "mean": 5.1403000000000265,
            "sd": 0.7761513447775502,
            "attainable": {
              "minimum": 3.55,
              "maximum": 6.25
            },
            "cuts": {
              "lower": {
                "percentile": 0.33,
                "raw": 4.75
              },
              "upper": {
                "percentile": 0.67,
                "raw": 5.8
              }
            }
          }
        }
      }
    },
    "analyst": {
      "headline": {
        "control": {
          "mean": 4.5275599999999985,
          "sd": 0.2771123353443508,
          "attainable": {
            "minimum": 3.19,
            "maximum": 5.73
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.39
            },
            "upper": {
              "percentile": 0.67,
              "raw": 4.65
            }
          }
        },
        "governance": {
          "mean": 4.617340000000001,
          "sd": 0.28342393053516146,
          "attainable": {
            "minimum": 3.39,
            "maximum": 5.95
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.49
            },
            "upper": {
              "percentile": 0.67,
              "raw": 4.733300000000001
            }
          }
        },
        "industrial": {
          "mean": 4.438839999999999,
          "sd": 0.22817242252296818,
          "attainable": {
            "minimum": 3.52,
            "maximum": 4.95
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.35
            },
            "upper": {
              "percentile": 0.67,
              "raw": 4.55
            }
          }
        },
        "safety": {
          "mean": 4.5227,
          "sd": 0.20385217683409715,
          "attainable": {
            "minimum": 3.73,
            "maximum": 5.19
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.43
            },
            "upper": {
              "percentile": 0.67,
              "raw": 4.62
            }
          }
        }
      },
      "lanes": {
        "controls": {
          "control": {
            "mean": 4.568200000000007,
            "sd": 0.6021022836694774,
            "attainable": {
              "minimum": 2.9,
              "maximum": 6.07
            },
            "cuts": {
              "lower": {
                "percentile": 0.33,
                "raw": 4.32
              },
              "upper": {
                "percentile": 0.67,
                "raw": 4.85
              }
            }
          }
        },
        "capacity": {
          "industrial": {
            "mean": 4.975400000000002,
            "sd": 0.5327697814253356,
            "attainable": {
              "minimum": 2.98,
              "maximum": 6.12
            },
            "cuts": {
              "lower": {
                "percentile": 0.33,
                "raw": 4.72
              },
              "upper": {
                "percentile": 0.67,
                "raw": 5.24
              }
            }
          }
        },
        "governance": {
          "governance": {
            "mean": 4.816080000000012,
            "sd": 0.5214558788622486,
            "attainable": {
              "minimum": 3.4,
              "maximum": 6.25
            },
            "cuts": {
              "lower": {
                "percentile": 0.33,
                "raw": 4.6
              },
              "upper": {
                "percentile": 0.67,
                "raw": 5
              }
            }
          },
          "safety": {
            "mean": 5.023800000000007,
            "sd": 0.48418876484280376,
            "attainable": {
              "minimum": 3.58,
              "maximum": 6.13
            },
            "cuts": {
              "lower": {
                "percentile": 0.33,
                "raw": 4.7934
              },
              "upper": {
                "percentile": 0.67,
                "raw": 5.2233
              }
            }
          }
        }
      }
    }
  }
} as const satisfies Record<
  ModuleSlug,
  Record<QuizMode, ModuleModeCalibration>
>
