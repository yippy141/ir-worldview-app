import type { ModuleModeCalibration } from "@/lib/modules/calibration"
import type { QuizMode } from "@/lib/types"

/** Frozen Security bank-v4/scorer-v2 calibration for historical replay. */
export const SECURITY_V4_CALIBRATION = {
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
} as const satisfies Record<
  QuizMode,
  ModuleModeCalibration
>
