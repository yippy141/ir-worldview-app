import type { ModuleModeCalibration } from "@/lib/modules/calibration"
import type { QuizMode } from "@/lib/types"

/** Frozen Security bank-v3/scorer-v2 calibration used for historical replay. */
export const SECURITY_V22_CALIBRATION = {
  "standard": {
    "headline": {
      "activism": {
        "mean": 4.266460000000006,
        "sd": 0.30125216746108224,
        "attainable": {
          "minimum": 3.21,
          "maximum": 5.48
        },
        "cuts": {
          "lower": {
            "percentile": 0.33,
            "raw": 4.14
          },
          "upper": {
            "percentile": 0.67,
            "raw": 4.39
          }
        }
      },
      "escalation": {
        "mean": 4.305180000000004,
        "sd": 0.2376168504125915,
        "attainable": {
          "minimum": 3.58,
          "maximum": 5.18
        },
        "cuts": {
          "lower": {
            "percentile": 0.33,
            "raw": 4.2
          },
          "upper": {
            "percentile": 0.67,
            "raw": 4.4
          }
        }
      },
      "alliance": {
        "mean": 4.244479999999999,
        "sd": 0.256677871270587,
        "attainable": {
          "minimum": 3.63,
          "maximum": 4.8
        },
        "cuts": {
          "lower": {
            "percentile": 0.33,
            "raw": 4.11
          },
          "upper": {
            "percentile": 0.67,
            "raw": 4.36
          }
        }
      },
      "legitimacy": {
        "mean": 4.348460000000004,
        "sd": 0.2788487554212857,
        "attainable": {
          "minimum": 3.5,
          "maximum": 4.99
        },
        "cuts": {
          "lower": {
            "percentile": 0.33,
            "raw": 4.24
          },
          "upper": {
            "percentile": 0.67,
            "raw": 4.49
          }
        }
      }
    },
    "lanes": {
      "deterrence": {
        "activism": {
          "mean": 4.411640000000004,
          "sd": 0.5848132269366008,
          "attainable": {
            "minimum": 3.17,
            "maximum": 5.87
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.17
            },
            "upper": {
              "percentile": 0.67,
              "raw": 4.63
            }
          }
        },
        "escalation": {
          "mean": 4.452960000000003,
          "sd": 0.5106247530231963,
          "attainable": {
            "minimum": 3.43,
            "maximum": 5.8
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.23
            },
            "upper": {
              "percentile": 0.67,
              "raw": 4.63
            }
          }
        }
      },
      "alliances": {
        "alliance": {
          "mean": 4.575299999999997,
          "sd": 0.8887603220216351,
          "attainable": {
            "minimum": 2.9,
            "maximum": 6.25
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4
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
          "mean": 4.789839999999998,
          "sd": 0.6553380611562246,
          "attainable": {
            "minimum": 2.93,
            "maximum": 6
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.53
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
        "mean": 4.3250399999999996,
        "sd": 0.22700440171943803,
        "attainable": {
          "minimum": 3.33,
          "maximum": 5.44
        },
        "cuts": {
          "lower": {
            "percentile": 0.33,
            "raw": 4.21
          },
          "upper": {
            "percentile": 0.67,
            "raw": 4.43
          }
        }
      },
      "escalation": {
        "mean": 4.332520000000006,
        "sd": 0.1860958075830835,
        "attainable": {
          "minimum": 3.58,
          "maximum": 5.21
        },
        "cuts": {
          "lower": {
            "percentile": 0.33,
            "raw": 4.246700000000001
          },
          "upper": {
            "percentile": 0.67,
            "raw": 4.403300000000001
          }
        }
      },
      "alliance": {
        "mean": 4.301879999999997,
        "sd": 0.20761807628431586,
        "attainable": {
          "minimum": 3.51,
          "maximum": 5.01
        },
        "cuts": {
          "lower": {
            "percentile": 0.33,
            "raw": 4.21
          },
          "upper": {
            "percentile": 0.67,
            "raw": 4.39
          }
        }
      },
      "legitimacy": {
        "mean": 4.354379999999999,
        "sd": 0.19968729453823528,
        "attainable": {
          "minimum": 3.56,
          "maximum": 4.87
        },
        "cuts": {
          "lower": {
            "percentile": 0.33,
            "raw": 4.26
          },
          "upper": {
            "percentile": 0.67,
            "raw": 4.46
          }
        }
      }
    },
    "lanes": {
      "deterrence": {
        "activism": {
          "mean": 4.477079999999995,
          "sd": 0.4674324267741811,
          "attainable": {
            "minimum": 3.16,
            "maximum": 5.92
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.26
            },
            "upper": {
              "percentile": 0.67,
              "raw": 4.66
            }
          }
        },
        "escalation": {
          "mean": 4.471479999999997,
          "sd": 0.39892481697683313,
          "attainable": {
            "minimum": 3.38,
            "maximum": 5.8
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.313400000000001
            },
            "upper": {
              "percentile": 0.67,
              "raw": 4.64
            }
          }
        }
      },
      "alliances": {
        "alliance": {
          "mean": 4.635980000000002,
          "sd": 0.5971020344966174,
          "attainable": {
            "minimum": 3.02,
            "maximum": 6.25
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.3701
            },
            "upper": {
              "percentile": 0.67,
              "raw": 4.88
            }
          }
        }
      },
      "legitimacy": {
        "legitimacy": {
          "mean": 4.884520000000004,
          "sd": 0.507293573387245,
          "attainable": {
            "minimum": 2.94,
            "maximum": 6.06
          },
          "cuts": {
            "lower": {
              "percentile": 0.33,
              "raw": 4.66
            },
            "upper": {
              "percentile": 0.67,
              "raw": 5.126600000000001
            }
          }
        }
      }
    }
  }
} as const satisfies Record<QuizMode, ModuleModeCalibration>

