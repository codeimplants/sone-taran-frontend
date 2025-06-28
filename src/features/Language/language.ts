import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    resources: {
      // English
      en: {
        translation: {
          // Login Page
          loginPage: {
            loginText: "Sign in",
            phoneNumber: "Phone Number",
            sendOtp: "Send OTP",
            or: "or",
            SignInEmail: "Sign in with email",
            error: {
              phoneRequired: "Phone number is required",
              phoneLength: "Phone number must be exactly 10 digits"
            }
          },

          // Email Page
          emailPage: {
            emalLoginText: "Sign in",
            Email: "Email",
            sendOtp: "Send OTP",
            or: "or",
            SignInPhone: "Sign in with Phone Number",
            error: {
              emailRequired: "Email is required",
              emailValidate: "Invalid email format"
            }
          },

          // Otp Page
          OtpPage: {
            OtpText: "Sign in",
            otp: "Otp",
            resendOtp: "Resend OTP",
            verifyOtp: "Verify",
            or: "or",
            error: {
              otpRequired: "OTP is required",
              otpLength: "Invalid OTP",
              otpInvalid: "Invalid OTP. Please try again."
            },
            success: {
              otpSuccess: "OTP verified successfully"
            }
          },

          // Breadcrums
          menuItems: {
            dashboard: "Dashboard",
            kalam: "Kalams",
            customer: "Customers",
            settings: "Settings",
            calculator: "Calculators",
            logout: "Logout"
          },

          // Logout
          logoutModal: {
            text: "Are you sure ? you want to Logout.",
            yes: "Yes",
            cancel: "Cancel"
          },

          // Kalam 
          kalamPage: {
            sr: "Sr",
            id: "ID",
            customer: "Customer",
            kalam: "Kalam",
            startDate: "Start Date",
            loanAmt: "Loan Amt",
            amtDue: "Amt Due",
            customerROI: "Customer ROI",
            merchant: "Merchant",
            todayValue: "Today's Value",
            validity: "Validity",
            viewProfile: "View Profile"
          },

          // Customer
          customerPage: {
            sr: "Sr",
            id: "ID",
            name: "Name",
            contact: "Contact",
            address: "Address",
            validity: "Validity",
            viewProfile: "View Profile"
          },

          // Kalam details Page
          kalamDetailsPage: {
            kalam: "Kalam",
            // Kalam Details
            kalamDetail: "Kalam Details",
            kalams: {
              itemName: "Item name",
              materialType: "Material type",
              goldRate: "Gold rate",
              grossWeight: "Gross weight",
              netWeight: "Net weight",
              purity: "Purity",
              quantity: "Quantity",
            },
            // Loan Details
            loanDetails: "Loan Details",
            Loan: {
              loanStartDate: "Loan start date",
              customerAmt: "Customer amount",
              customerROI: "Customer ROI",
              dukandarAmt: "Dukandar amount",
              dukandarROI: "Dukandar ROI",
              totalAmt: "Total amount",
              validity: "Validity"
            },
            // Customer Details  Merchant Details
            customerDetails: "Customer Details",
            merchantDetails: "Merchant Details",
            customerMerchantFields: {
              name: "Name",
              contact: "Contact",
              address: "Address",
            },
            edit: "Edit",
            delete: "Delete"
          },

          // Customer Details
          customerDetailsPage: {
            customerDetails: "Customer Details",
            customer: {
              name: "Name",
              contact: "Contact",
              address: "Address",
            },
            loan: "Loan",
            loans: {
              itemDetails: "Item Details",
              item: {
                itemName: "Item name",
                materialType: "Material type",
                grossWeight: "Gross weight",
                netWeight: "Net weight",
                purity: "Purity",
                goldRate: "Gold rate",
              },
              loanDetails: "Loan Details",
              loan: {
                loanStartDate: "Loan start date",
                customerAmt: "Customer amount",
                customerROI: "Customer ROI",
              }
            },
            edit: "Edit",
            delete: "Delete"
          },

          // kalam card
          kalamCard: {
            amount: "Amount ",
            ROI: "ROI",
            merchant: "Merchant",
            due: "Due",
            view: "View",
            edit: "Edit",
            delete: "Delete",
          },

          // Customer Card
          customerCard: {
            contact: "Contact",
            address: "Address",
            view: "View",
            edit: "Edit",
            delete: "Delete",
          },

          // Calculator
          calculatorPage: {
            // Wholesale Value
            wholePage: "Wholesale Value",
            wholesaleValueCalculator: {
              wholesaleValue: "Wholesale Value",
              weight: "Weight (Grams)",
              purity: "Purity (%)",
              wastage: "Wastage(%)",
              goldRate: "Gold Rate (₹/grams for 99.5%)",
              error: {
                weightError: "Weight is required",
                weightPositiveError: "Weight must be positive",
                purityError: "Purity is required",
                wastageError: "Wastage is required",
                goldRateError: "Gold rate is required",
              }
            },
            // Loan Duration
            loanpage: "Loan Duration",
            loanDurationCalculator: {
              loanDuration: "Loan Duration Calculator",
              startDate: "Start Date",
              endDate: "End Date",
              interestFree: "1 Day Interest Free",

              error: {
                startDateError: "Start date is required",
                endDateError: "End date is required"
              }
            },
            // Gold Valuation
            goldPage: "Gold Valuation",
            goldRateCalculator: {
              goldValuation: "Gold Valuation",
              grossWeight: "Gross Wt",
              netWeight: "Net Wt",
              purity: "Purity",
              metalRate: "Metal Rate",
              ROI: "ROI",
              loanAmt: "Loan Amount",
              loanDuration: "Loan Duration",
              percentage: "Choose Loan Percentage",
              error: {
                grossWeightError: 'Gross Weight is required',
                grossWeightPositiveError: 'Must be positive',
                netWeightError: 'Net Weight is required',
                netWeightPositiveError: 'Must be positive',
                purityError: 'Purity is required',
                metalRateError: 'Metal Rate is required',
                ROIError: 'Rate of Interest is required',
              }
            },
            // Interest Calculator
            interestPage: "Interest Calculator",
            interestCalculator: {
              interestCal: "Compound Interest Calculator",
              startDate: "Start Date",
              endDate: "End Date",
              loanAmt: "Loan Amount",
              ROI: "ROI",
              interestFree: "1 Day Interest Free",
              roundOff: "Round off Loan Duration",
              compound: "Compound Interest",
              simple: "Simple Interest",
              error: {
                startDateError: 'Start Date is required',
                endDate: 'End Date is required',
                loanAmt: 'Loan Amount is required',
                loanAmtPositive: 'Loan Amount must be positive',
                ROIError: 'ROI is required',
                ROIPositiveError: 'ROI must be positive',
              }
            },

            // Button
            button: {
              calculate: "Calculate",
              reset: "Reset"
            }
          }
        }
      },

      // Marathi
      mr: {
        translation: {
          // Login Page
          loginPage: {
            loginText: "साइन इन करा",
            phoneNumber: "फोन नंबर",
            sendOtp: "Otp पाठवा",
            or: "किंवा",
            SignInEmail: "ईमेलसह साइन इन करा",
            error: {
              phoneRequired: "फोन नंबर आवश्यक आहे",
              phoneLength: "फोन नंबर अगदी १० अंकांचा असावा."
            }
          },

          // Email Page
          emailPage: {
            emalLoginText: "साइन इन करा",
            Email: "ईमेल",
            sendOtp: "Otp पाठवा",
            or: "किंवा",
            SignInPhone: "फोन नंबर वापरून साइन इन करा",
            error: {
              emailRequired: "ईमेल आवश्यक आहे",
              emailValidate: "अवैध ईमेल स्वरूप"
            }
          },

          // Otp Page
          OtpPage: {
            OtpText: "साइन इन करा",
            otp: "Otp",
            resendOtp: "ओटीपी पुन्हा पाठवा",
            verifyOtp: "पडताळणी करा",
            or: "किंवा",
            error: {
              otpRequired: "OTP आवश्यक आहे",
              otpLength: "अवैध OTP",
              otpInvalid: "अवैध OTP. कृपया पुन्हा प्रयत्न करा."
            },
            success: {
              otpSuccess: "OTP यशस्वीरित्या सत्यापित केले"
            }
          },

          // Breadcrums 
          menuItems: {
            dashboard: "डॅशबोर्ड",
            kalam: "कलम ",
            customer: "ग्राहक",
            settings: "सेटिंग्ज",
            calculator: "कॅल्क्युलेटर",
            logout: "लॉगआउट"
          },

          // Logout 
          logoutModal: {
            text: "तुम्हाला खात्री आहे का? तुम्ही लॉगआउट करू इच्छिता.",
            yes: "होय",
            cancel: "रद्द करा"
          },

          // Kalam 
          kalamPage: {
            sr: "Sr",
            id: "ID",
            customer: "ग्राहक",
            kalam: "कलम",
            startDate: "प्रारंभ तारीख",
            loanAmt: "कर्जाची रक्कम",
            amtDue: "देय रक्कम",
            customerROI: "ग्राहक व्याज दर",
            merchant: "व्यापारी",
            todayValue: "आजचे मूल्य",
            validity: "वैधता",
            viewProfile: "प्रोफाइल पहा"
          },

          // Customer
          customerPage: {
            sr: "Sr",
            id: "ID",
            name: "नाव",
            contact: "संपर्क",
            address: "पत्ता",
            validity: "वैधता",
            viewProfile: "प्रोफाइल पहा"
          },

          // Kalam Details
          kalamDetailsPage: {
            kalam: "कलम",
            // Kalam Details
            kalamDetail: "कलम तपशील",
            kalams: {
              itemName: "वस्तूचे नाव",
              materialType: "साहित्य प्रकार",
              goldRate: "सोन्याचा दर",
              grossWeight: "एकूण वजन",
              netWeight: "निव्वळ वजन",
              purity: "शुद्धता",
              quantity: "प्रमाण",
            },
            // Loan Details
            loanDetails: "कर्ज तपशील",
            Loan: {
              loanStartDate: "कर्ज सुरू होण्याची तारीख",
              customerAmt: "ग्राहकाची रक्कम",
              customerROI: "ग्राहक व्याज दर",
              dukandarAmt: "दुकानदार रक्कम ",
              dukandarROI: "दुकानदार व्याज दर",
              totalAmt: "पूर्ण रकम ",
              validity: "वैधता",
            },

            // Customer Details  Merchant Details
            customerDetails: "ग्राहक तपशील",
            merchantDetails: "व्यापारी तपशील",
            customerMerchantFields: {
              name: "नाव",
              contact: "संपर्क",
              address: "पत्ता",
            },
            edit: "बदल",
            delete: "हटवा"
          },

          // Customer Details
          customerDetailsPage: {
            customerDetails: "ग्राहक तपशील",
            customer: {
              name: "नाव",
              contact: "संपर्क",
              address: "पत्ता",
            },
            loan: "कर्ज",
            loans: {
              itemDetails: "वस्तूचे तपशील",
              item: {
                itemName: "वस्तूचे नाव",
                materialType: "साहित्य प्रकार",
                goldRate: "सोन्याचा दर",
                grossWeight: "एकूण वजन",
                netWeight: "निव्वळ वजन",
                purity: "शुद्धता",
              },
              loanDetails: "कर्ज तपशील",
              loan: {
                loanStartDate: "कर्ज सुरू होण्याची तारीख",
                customerAmt: "ग्राहकाची रक्कम",
                customerROI: "ग्राहक व्याज दर",
              }
            },
            edit: "बदल",
            delete: "हटवा"
          },

          // kalam card
          kalamCard: {
            amount: "रक्कम ",
            ROI: "व्याज दर",
            merchant: "व्यापारी",
            due: "देय रक्कम",
            view: "बघा",
            edit: "बदल",
            delete: "हटवा",
          },

          // Customer Card
          customerCard: {
            contact: "संपर्क",
            address: "पत्ता",
            view: "बघा",
            edit: "बदल",
            delete: "हटवा",
          },

          // Calculator
          calculatorPage: {
            // Wholesale Value
            wholePage: "घाऊक मूल्य",
            wholesaleValueCalculator: {
              wholesaleValue: "घाऊक मूल्य",
              weight: "वजन (Grams)",
              purity: "शुद्धता (%)",
              wastage: "वाया गेलेले (%)",
              goldRate: "सोन्याचा दर (₹/grams 99.5% साठी)",
              error: {
                weightError: "वजन आवश्यक आहे",
                weightPositiveError: "वजन धनात्मक असणे आवश्यक आहे",
                purityError: "शुद्धता आवश्यक आहे",
                wastageError: "अपव्यय आवश्यक आहे",
                goldRateError: "सोन्याचा दर आवश्यक आहे"
              }
            },

            // Loan Duration
            loanpage: "कर्जाचा कालावधी",
            loanDurationCalculator: {
              loanDuration: "कर्जाचा कालावधी कॅल्क्युलेटर",
              startDate: "प्रारंभ तारीख",
              endDate: "समाप्ती तारीख",
              interestFree: "1 दिवस व्याजमुक्त",
              error: {
                startDateError: "प्रारंभ तारीख आवश्यक आहे",
                endDateError: "समाप्ती तारीख आवश्यक आहे"
              }
            },

            // Gold Valuation
            goldPage: "सोन्याचे मूल्यांकन",
            goldRateCalculator: {
              goldValuation: "सोन्याचे मूल्यांकन",
              grossWeight: "एकूण वजन",
              netWeight: "निव्वळ वजन",
              purity: "शुद्धता",
              metalRate: "धातूचा दर",
              ROI: "परताव्याचा दर (ROI)",
              loanAmt: "कर्जाची रक्कम",
              loanDuration: "कर्जाचा कालावधी",
              percentage: "कर्जाची टक्केवारी निवडा",
              error: {
                grossWeightError: 'एकूण वजन आवश्यक आहे',
                grossWeightPositiveError: 'वजन शून्यापेक्षा जास्त असणे आवश्यक आहे',
                netWeightError: 'निव्वळ वजन आवश्यक आहे',
                netWeightPositiveError: 'वजन शून्यापेक्षा जास्त असणे आवश्यक आहे',
                purityError: 'शुद्धता आवश्यक आहे',
                metalRateError: 'धातूचा दर आवश्यक आहे',
                ROIError: 'व्याज दर आवश्यक आहे'
              }
            },

            // Interest Calculator
            interestPage: "व्याज कॅल्क्युलेटर",
            interestCalculator: {
              interestCal: "चक्रवाढ व्याज कॅल्क्युलेटर",
              startDate: "प्रारंभ तारीख",
              endDate: "समाप्ती तारीख",
              loanAmt: "कर्जाची रक्कम",
              ROI: "परताव्याचा दर (ROI)",
              interestFree: "1 दिवस व्याजमुक्त",
              roundOff: "कर्जाचा कालावधी पूर्णांकित करा",
              compound: "चक्रवाढ व्याज",
              simple: "साधे व्याज",
              error: {
                startDateError: 'प्रारंभ तारीख आवश्यक आहे',
                endDateError: 'समाप्ती तारीख आवश्यक आहे',
                loanAmtError: 'कर्ज रक्कम आवश्यक आहे',
                loanAmtPositiveError: 'कर्ज रक्कम धनात्मक असणे आवश्यक आहे',
                ROIError: 'परताव्याचा दर (ROI) आवश्यक आहे',
                ROIPositiveError: 'परताव्याचा दर (ROI) धनात्मक असणे आवश्यक आहे'
              }
            },

            button: {
              calculate: "गणना करा",
              reset: "रीसेट",
            }
          }
        }
      }
    }
  });

export default i18n;
