var fonts = {
    Roboto: {
      normal: './fonts/Montserrat-Regular.ttf',
      bold: './fonts/Montserrat-Bold.ttf',
      italics: './fonts/Montserrat-Italic.ttf',
      bolditalics: './fonts/Montserrat-BoldItalic.ttf'
    }
};

var convert = require('xml-js');
var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
const { AwesomeQR } = require("awesome-qr");
const fs = require("fs");
const xml = require('./xml.js')

const dbcatcatalogs = require('../controllers/cat-catalogs')
const dbcatgeneralparameters = require('../controllers/cat-general-parameters')

var xml64 = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPGNmZGk6Q29tcHJvYmFudGUgeG1sbnM6Y2ZkaT0iaHR0cDovL3d3dy5zYXQuZ29iLm14L2NmZC8zIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4bWxuczpjYXJ0YXBvcnRlMjA9Imh0dHA6Ly93d3cuc2F0LmdvYi5teC9DYXJ0YVBvcnRlMjAiIHhzaTpzY2hlbWFMb2NhdGlvbj0iaHR0cDovL3d3dy5zYXQuZ29iLm14L2NmZC8zIGh0dHA6Ly93d3cuc2F0LmdvYi5teC9zaXRpb19pbnRlcm5ldC9jZmQvMy9jZmR2MzMueHNkIGh0dHA6Ly93d3cuc2F0LmdvYi5teC9DYXJ0YVBvcnRlMjAgaHR0cDovL3d3dy5zYXQuZ29iLm14L3NpdGlvX2ludGVybmV0L2NmZC9DYXJ0YVBvcnRlL0NhcnRhUG9ydGUyMC54c2QiIFZlcnNpb249IjMuMyIgU2VyaWU9IlRSIiBGb2xpbz0iMTEiIEZlY2hhPSIyMDIxLTEyLTE3VDEzOjI1OjE3IiBTdWJUb3RhbD0iMCIgTW9uZWRhPSJYWFgiIFRvdGFsPSIwIiBUaXBvRGVDb21wcm9iYW50ZT0iVCIgTHVnYXJFeHBlZGljaW9uPSI3NjAzMCIgTm9DZXJ0aWZpY2Fkbz0iMDAwMDEwMDAwMDA1MDI1NDM1MjMiIENlcnRpZmljYWRvPSJNSUlHTERDQ0JCU2dBd0lCQWdJVU1EQXdNREV3TURBd01EQTFNREkxTkRNMU1qTXdEUVlKS29aSWh2Y05BUUVMQlFBd2dnR0VNU0F3SGdZRFZRUUREQmRCVlZSUFVrbEVRVVFnUTBWU1ZFbEdTVU5CUkU5U1FURXVNQ3dHQTFVRUNnd2xVMFZTVmtsRFNVOGdSRVVnUVVSTlNVNUpVMVJTUVVOSlQwNGdWRkpKUWxWVVFWSkpRVEVhTUJnR0ExVUVDd3dSVTBGVUxVbEZVeUJCZFhSb2IzSnBkSGt4S2pBb0Jna3Foa2lHOXcwQkNRRVdHMk52Ym5SaFkzUnZMblJsWTI1cFkyOUFjMkYwTG1kdllpNXRlREVtTUNRR0ExVUVDUXdkUVZZdUlFaEpSRUZNUjA4Z056Y3NJRU5QVEM0Z1IxVkZVbEpGVWs4eERqQU1CZ05WQkJFTUJUQTJNekF3TVFzd0NRWURWUVFHRXdKTldERVpNQmNHQTFVRUNBd1FRMGxWUkVGRUlFUkZJRTFGV0VsRFR6RVRNQkVHQTFVRUJ3d0tRMVZCVlVoVVJVMVBRekVWTUJNR0ExVUVMUk1NVTBGVU9UY3dOekF4VGs0ek1Wd3dXZ1lKS29aSWh2Y05BUWtDRTAxeVpYTndiMjV6WVdKc1pUb2dRVVJOU1U1SlUxUlNRVU5KVDA0Z1EwVk9WRkpCVENCRVJTQlRSVkpXU1VOSlQxTWdWRkpKUWxWVVFWSkpUMU1nUVV3Z1EwOU9WRkpKUWxWWlJVNVVSVEFlRncweE9URXlNakF5TXpNeE16RmFGdzB5TXpFeU1qQXlNek14TXpGYU1JSDZNVEF3TGdZRFZRUURFeWREUVZOQklFUkpRVm9nUkVVZ1RVRlJWVWxPUVZNZ1JFVWdRMDlUUlZJZ1UwRWdSRVVnUTFZeE1EQXVCZ05WQkNrVEowTkJVMEVnUkVsQldpQkVSU0JOUVZGVlNVNUJVeUJFUlNCRFQxTkZVaUJUUVNCRVJTQkRWakV3TUM0R0ExVUVDaE1uUTBGVFFTQkVTVUZhSUVSRklFMUJVVlZKVGtGVElFUkZJRU5QVTBWU0lGTkJJRVJGSUVOV01TVXdJd1lEVlFRdEV4eERSRTAzTmpBeE1qUkRPRFVnTHlCRVNVVkRNemt3T1RFMFUwSTBNUjR3SEFZRFZRUUZFeFVnTHlCRVNVVkRNemt3T1RFMFNFUkdXbE5PTURBeEd6QVpCZ05WQkFzVEVrTkdSRWtnUmtGRElFTkJVMEVnUkVsQldqQ0NBU0l3RFFZSktvWklodmNOQVFFQkJRQURnZ0VQQURDQ0FRb0NnZ0VCQUxBd2lJWktqVEN0VHI2KzFWWVNHMXlXRHkrVnhhL0hMUUM1cUlPRHdmYTh2SS9lbDc5N0JQemRIdVEwSXdJU0hPUFRNelRCT3NmQ09sWktweHo2LzRGK1ljazJoK2dLM2JnaXYyOWVUR0ZQSHk2b2NPZ2JrYURIdi9OeHVPUHd3ZkpaanltZmpxdHRybmllQm4xUlIvNFlYTzZBRHJpNy9kejRTcVMvLzk1RVpCNk1tZ2g1ZElKcDI1TElNREFDQmp2ei9YTUd6MldvK0tsOUhCNXQ4NzRaUFAzM1B3WEVXVVNjdXp2SklLdmtUT2x2djNtVWR2bExEMkJwckF3VU9BbG9iakVHSUEyY2Jna1gzUXRKYU9uWmFxZThiSGZ3Y3lxTmtWblA3d3cvcFdpOXBvanMvOUNoR3ZROHE0ekhTVmVmeEJBMnlFR3ZOS2lETURHVEhkY0NBd0VBQWFNZE1Cc3dEQVlEVlIwVEFRSC9CQUl3QURBTEJnTlZIUThFQkFNQ0JzQXdEUVlKS29aSWh2Y05BUUVMQlFBRGdnSUJBSitPMWhJVlJ0eVdmTGduUlJlTUZFUFV3dHF0ZWR1NzlKYnhwSTVWS3c5Ym1hYzg4SUZDWXZ6Ulp6bjdTWURkWWtjSVl5Mk14VjVwby9GRTB2NExveDJNaE53ZWMzRHNocEM5MkE2cklybGJNZzFFRjcxR2pUTXBrSFp5bHRmOGhmSm9PODFwQmNHbGdRWUlGZ3RZS3EwdnJRdUtQSHRQc3pxeWxLSE1WVWZyNVpZSHpmTVVwaWV1c0N2UVNweVlpRGlzbGt2RDUrQno1M3JtNk9ZVG9LYWJ4RS9yVkl3cWo5ZHE1WVBvOFp0amhnU0tPZlpSMFhIQklNLzAxWndkWC96N29UMkdmOVlyU2Q0alEzL3RSVEJCTHNlTzVMMHQyaDJuVEErbDNudmkxdFcyNFgwRUZEY2liNFVkS1NpZEQvUEVobWtnV2JhOTdLQjU4aXkxZlNJOW1Lam9sVk5SbmVHK0RSMlhsOENCUjNiYnRIaVNRckNxMU1Ndy9raDBmNDl5SWg4Z2N5OXpubWRwejErMnFHRUhPZDhiR2FaelhsZHkwMmExVG1RMXJFQ2JnK1Z4dUZ0S1luSVppRGdsaSs5U09pbWcwakRZaXJqT0UwZmJtTkFGbmhscXJ0RHc1cFNYV0U2WE85MlZBR2w2SFJzTlVSREU3N3QxelpNZVJ4VG5HOEVOUHkyMG9BbUdJQ1BnUVhEOE5ySHpiN1A5ZXR3VmFCaEp4Q3J6cVR0NlRNeWhmUnU3SmJGWmtrUHBkaVNpQlg2UzZNZEpTeFVyNnduRmcxRmtvMXBjYUN2MGxzV0pkaFlhZTBaMDNwckg3VGNDSXlGSmxwUkFUczhGUG9mVlUyN2pQRWNtMEUvZmlJN05wbE84UWIrUHlZK2Vsa0RBT1NieTBEU2siIFNlbGxvPSJhRGxVOHI1dmw2VS9GQmxFV0RNTlFpY0QvOUM4MHRHcmRYVVFvbEZpcU85UlA0WDhtUkhtR3pHNWdEWjhqcTJZQStHbW5VOGRNd2dUa3R2ZWVVZzFYbHNrMDJlYnJZbGlZRHRlTFl2NlZ0MUlDZVRRUVFUejNha1BLNnBhYk5ZTUFrdzVXVkJyUDYvcjlYemtrMzhSaHpLMGFadGdBZE04NWZDcFI1VWJmMGM3VWdBOW9DVXpzRkJVSmtzZVA2TEVmQ0haM2l3ci9Gd2JXU28rR05RUVF2Q2dQS0ZBT0FhcnFkajZBZDl2eFZvdWt3SXNrUkFoK1JjaFZKUml5VUo0ZnZuQW9EV1ZrUmxaclVNUzNNRC90Nkp1a0UzU0pOdXAvRVdkSTMvdWU5Zmp0TG9QRnpTN2djYmpFV1dTcit3VmVRZlJsNTNyQWhJVmFuaE9XaDRZU3c9PSI+Cgk8Y2ZkaTpFbWlzb3IgTm9tYnJlPSJDQVNBIERJQVogREUgTUFRVUlOQVMgREUgQ09TRVIsUy5BLiBERSBDVi4iIFJlZ2ltZW5GaXNjYWw9IjYwMSIgUmZjPSJDRE03NjAxMjRDODUiIC8+Cgk8Y2ZkaTpSZWNlcHRvciBSZmM9IkNETTc2MDEyNEM4NSIgTm9tYnJlPSJDQVNBIERJQVogREUgTUFRVUlOQVMgREUgQ09TRVIsUy5BLiBERSBDVi4iIFVzb0NGREk9IlAwMSIgLz4KCTxjZmRpOkNvbmNlcHRvcz4KCQk8Y2ZkaTpDb25jZXB0byBDbGF2ZVByb2RTZXJ2PSI3ODEwMTgwMiIgQ2FudGlkYWQ9IjEuMDAiIENsYXZlVW5pZGFkPSJFNDgiIFVuaWRhZD0iU0VSVklDSU8iIERlc2NyaXBjaW9uPSJUUkFTTEFETyBERSBNRVJDQU5DSUEiIFZhbG9yVW5pdGFyaW89IjAuMDAiIEltcG9ydGU9IjAuMDAiIC8+Cgk8L2NmZGk6Q29uY2VwdG9zPgoJPGNmZGk6Q29tcGxlbWVudG8+CgkJPGNhcnRhcG9ydGUyMDpDYXJ0YVBvcnRlIFZlcnNpb249IjIuMCIgVHJhbnNwSW50ZXJuYWM9Ik5vIiBUb3RhbERpc3RSZWM9IjUuMDAiPgoJCQk8Y2FydGFwb3J0ZTIwOlViaWNhY2lvbmVzPgoJCQkJPGNhcnRhcG9ydGUyMDpVYmljYWNpb24gVGlwb1ViaWNhY2lvbj0iT3JpZ2VuIiBJRFViaWNhY2lvbj0iT1IwMDUyNjAiIFJGQ1JlbWl0ZW50ZURlc3RpbmF0YXJpbz0iQ0RNNzYwMTI0Qzg1IiBOb21icmVSZW1pdGVudGVEZXN0aW5hdGFyaW89IkNBU0EgRElBWiBERSBNQVFVSU5BUyBERSBDT1NFUiBTLkEgREUgQ1YiIEZlY2hhSG9yYVNhbGlkYUxsZWdhZGE9IjIwMjEtMTItMTVUMTc6MDA6MDAiPgoJCQkJCTxjYXJ0YXBvcnRlMjA6RG9taWNpbGlvIENhbGxlPSJBVkVOSURBIEFMVkFSTyBPQlJFR09OICBOby4gNjUwIiBDb2xvbmlhPSIwMzY2IiBMb2NhbGlkYWQ9IjA2IiBNdW5pY2lwaW89IjAxNyIgRXN0YWRvPSJHVUEiIFBhaXM9Ik1FWCIgQ29kaWdvUG9zdGFsPSIzNjUwMCIgLz4KCQkJCTwvY2FydGFwb3J0ZTIwOlViaWNhY2lvbj4KCQkJCTxjYXJ0YXBvcnRlMjA6VWJpY2FjaW9uIFRpcG9VYmljYWNpb249IkRlc3Rpbm8iIElEVWJpY2FjaW9uPSJERTAwMDkwNCIgUkZDUmVtaXRlbnRlRGVzdGluYXRhcmlvPSJDRE03NjAxMjRDODUiIE5vbWJyZVJlbWl0ZW50ZURlc3RpbmF0YXJpbz0iQ0FTQSBESUFaIERFIE1BUVVJTkFTIERFIENPU0VSLFMuQS4gREUgQ1YiIEZlY2hhSG9yYVNhbGlkYUxsZWdhZGE9IjIwMjEtMTItMTVUMTg6MDA6MDAiIERpc3RhbmNpYVJlY29ycmlkYT0iNS4wMCI+CgkJCQkJPGNhcnRhcG9ydGUyMDpEb21pY2lsaW8gQ2FsbGU9IlBST0xPTkdBQ0lPTiBDQUxaQURBIiBOdW1lcm9FeHRlcmlvcj0iMTIwIiBDb2xvbmlhPSIxNjQ0IiBMb2NhbGlkYWQ9IjA3IiBNdW5pY2lwaW89IjAyMCIgRXN0YWRvPSJHVUEiIFBhaXM9Ik1FWCIgQ29kaWdvUG9zdGFsPSIzNzUwMCIgLz4KCQkJCTwvY2FydGFwb3J0ZTIwOlViaWNhY2lvbj4KCQkJPC9jYXJ0YXBvcnRlMjA6VWJpY2FjaW9uZXM+CgkJCTxjYXJ0YXBvcnRlMjA6TWVyY2FuY2lhcyBQZXNvQnJ1dG9Ub3RhbD0iMS43NjAiIFVuaWRhZFBlc289IktHTSIgTnVtVG90YWxNZXJjYW5jaWFzPSIxIj4KCQkJCTxjYXJ0YXBvcnRlMjA6TWVyY2FuY2lhIEJpZW5lc1RyYW5zcD0iNTMxNDE2MDUiIERlc2NyaXBjaW9uPSJBZ3VqYXMgZGUgY29zdHVyYSIgQ2FudGlkYWQ9IjgwMC4wMDAwMDAiIENsYXZlVW5pZGFkPSJIODciIFBlc29FbktnPSIxLjc2MCIgVmFsb3JNZXJjYW5jaWE9IjAuMDAiIE1vbmVkYT0iTVhOIiAvPgoJCQkJPGNhcnRhcG9ydGUyMDpBdXRvdHJhbnNwb3J0ZSBQZXJtU0NUPSJUUEFGMDIiIE51bVBlcm1pc29TQ1Q9IjAiPgoJCQkJCTxjYXJ0YXBvcnRlMjA6SWRlbnRpZmljYWNpb25WZWhpY3VsYXIgQ29uZmlnVmVoaWN1bGFyPSJDMiIgUGxhY2FWTT0iR1dVNzY1QyIgQW5pb01vZGVsb1ZNPSIyMDA3IiAvPgoJCQkJCTxjYXJ0YXBvcnRlMjA6U2VndXJvcyBBc2VndXJhUmVzcENpdmlsPSJRVUFMSVRBUyIgUG9saXphUmVzcENpdmlsPSIzMjAwMzE0ODg3IiAvPgoJCQkJPC9jYXJ0YXBvcnRlMjA6QXV0b3RyYW5zcG9ydGU+CgkJCTwvY2FydGFwb3J0ZTIwOk1lcmNhbmNpYXM+CgkJCTxjYXJ0YXBvcnRlMjA6RmlndXJhVHJhbnNwb3J0ZT4KICAgICAgICAgIAkJCQk8Y2FydGFwb3J0ZTIwOlRpcG9zRmlndXJhIFRpcG9GaWd1cmE9IjAxIiBSRkNGaWd1cmE9IkxPVEU2NDExMTFJTDciIE51bUxpY2VuY2lhPSJUTDEyMDYxOTI5MDkiIE5vbWJyZUZpZ3VyYT0iTE9QRVogVEVPRklMTyIgLz4KCQkJPC9jYXJ0YXBvcnRlMjA6RmlndXJhVHJhbnNwb3J0ZT4KCQk8L2NhcnRhcG9ydGUyMDpDYXJ0YVBvcnRlPgoJPHRmZDpUaW1icmVGaXNjYWxEaWdpdGFsIHhtbG5zOnRmZD0iaHR0cDovL3d3dy5zYXQuZ29iLm14L1RpbWJyZUZpc2NhbERpZ2l0YWwiIHhzaTpzY2hlbWFMb2NhdGlvbj0iaHR0cDovL3d3dy5zYXQuZ29iLm14L1RpbWJyZUZpc2NhbERpZ2l0YWwgaHR0cDovL3d3dy5zYXQuZ29iLm14L3NpdGlvX2ludGVybmV0L2NmZC9UaW1icmVGaXNjYWxEaWdpdGFsL1RpbWJyZUZpc2NhbERpZ2l0YWx2MTEueHNkIiBWZXJzaW9uPSIxLjEiIFVVSUQ9IjZGOTA3NTgwLUJEQkQtNDcwMy04Qjc3LTY4MzFEN0M5RUQ2NCIgRmVjaGFUaW1icmFkbz0iMjAyMS0xMi0xN1QxMzo0MDo0MiIgUmZjUHJvdkNlcnRpZj0iU0ZFMDgwNzE3Mlc3IiBTZWxsb0NGRD0iYURsVThyNXZsNlUvRkJsRVdETU5RaWNELzlDODB0R3JkWFVRb2xGaXFPOVJQNFg4bVJIbUd6RzVnRFo4anEyWUErR21uVThkTXdnVGt0dmVlVWcxWGxzazAyZWJyWWxpWUR0ZUxZdjZWdDFJQ2VUUVFRVHozYWtQSzZwYWJOWU1Ba3c1V1ZCclA2L3I5WHprazM4Umh6SzBhWnRnQWRNODVmQ3BSNVViZjBjN1VnQTlvQ1V6c0ZCVUprc2VQNkxFZkNIWjNpd3IvRndiV1NvK0dOUVFRdkNnUEtGQU9BYXJxZGo2QWQ5dnhWb3Vrd0lza1JBaCtSY2hWSlJpeVVKNGZ2bkFvRFdWa1JsWnJVTVMzTUQvdDZKdWtFM1NKTnVwL0VXZEkzL3VlOWZqdExvUEZ6UzdnY2JqRVdXU3Ird1ZlUWZSbDUzckFoSVZhbmhPV2g0WVN3PT0iIE5vQ2VydGlmaWNhZG9TQVQ9IjIwMDAxMDAwMDAwMzAwMDIyNzc5IiBTZWxsb1NBVD0iT3ozRlp0c3o5VVoxMUpxakVXWS9SK3FUVGZXajdoOFVSYm9hb3FVVlRrT2NPM29UV0xKQUMwU1EzNThSdjN0RkhmanFudzJTRDZEa0hudXliWnhyZFRXWENBU05uV1hjN3pNbHVuL2tBY2dySVBYVm1xeHhSbmMyVmlsY1FqaUFNYS9wYys2UTc4YW9BamYyazFkYytNN0pOdExVKzNCaUhidmc2VU1GWkMxK1B1TTIvc2lreU1jWjJhZlJ4RUVTSFRzN1VmWDVINnhYTWlXSDg5OWVFd0dtMjFaWXpNNkFyV0xCK1ZHdEd1Y3BlcW96VW4vUXllNGZGK3I4a2tuSWtLVGNZSGR3azFyazcvcEVSblcyZmpjZjMvYTBIUnk5ckJaWGJNazJFRzFESmQxVktvbFZmR3JsdllkY1c3eVVDY0RSNyttcTdtY01zaVhieDd0WFNnPT0iIC8+PC9jZmRpOkNvbXBsZW1lbnRvPgoKPGNmZGk6QWRkZW5kYT4KPERhdG9zQWRpY2lvbmFsZXMgRU1BSUw9ImN4Y2lyYXB1YXRvQGNhc2FkaWF6LmJpeiIgLz4KPC9jZmRpOkFkZGVuZGE+PC9jZmRpOkNvbXByb2JhbnRlPgo="
var xml642 = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPGNmZGk6Q29tcHJvYmFudGUgeG1sbnM6Y2ZkaT0iaHR0cDovL3d3dy5zYXQuZ29iLm14L2NmZC8zIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4bWxuczpjYXJ0YXBvcnRlMjA9Imh0dHA6Ly93d3cuc2F0LmdvYi5teC9DYXJ0YVBvcnRlMjAiIHhzaTpzY2hlbWFMb2NhdGlvbj0iaHR0cDovL3d3dy5zYXQuZ29iLm14L2NmZC8zIGh0dHA6Ly93d3cuc2F0LmdvYi5teC9zaXRpb19pbnRlcm5ldC9jZmQvMy9jZmR2MzMueHNkIGh0dHA6Ly93d3cuc2F0LmdvYi5teC9DYXJ0YVBvcnRlMjAgaHR0cDovL3d3dy5zYXQuZ29iLm14L3NpdGlvX2ludGVybmV0L2NmZC9DYXJ0YVBvcnRlL0NhcnRhUG9ydGUyMC54c2QiIFZlcnNpb249IjMuMyIgU2VyaWU9IlRSIiBGb2xpbz0iMTgiIEZlY2hhPSIyMDIxLTEyLTE3VDE2OjAxOjQ2IiBTdWJUb3RhbD0iMCIgTW9uZWRhPSJYWFgiIFRvdGFsPSIwIiBUaXBvRGVDb21wcm9iYW50ZT0iVCIgTHVnYXJFeHBlZGljaW9uPSI3NjAzMCIgTm9DZXJ0aWZpY2Fkbz0iMDAwMDEwMDAwMDA1MDI1NDM1MjMiIENlcnRpZmljYWRvPSJNSUlHTERDQ0JCU2dBd0lCQWdJVU1EQXdNREV3TURBd01EQTFNREkxTkRNMU1qTXdEUVlKS29aSWh2Y05BUUVMQlFBd2dnR0VNU0F3SGdZRFZRUUREQmRCVlZSUFVrbEVRVVFnUTBWU1ZFbEdTVU5CUkU5U1FURXVNQ3dHQTFVRUNnd2xVMFZTVmtsRFNVOGdSRVVnUVVSTlNVNUpVMVJTUVVOSlQwNGdWRkpKUWxWVVFWSkpRVEVhTUJnR0ExVUVDd3dSVTBGVUxVbEZVeUJCZFhSb2IzSnBkSGt4S2pBb0Jna3Foa2lHOXcwQkNRRVdHMk52Ym5SaFkzUnZMblJsWTI1cFkyOUFjMkYwTG1kdllpNXRlREVtTUNRR0ExVUVDUXdkUVZZdUlFaEpSRUZNUjA4Z056Y3NJRU5QVEM0Z1IxVkZVbEpGVWs4eERqQU1CZ05WQkJFTUJUQTJNekF3TVFzd0NRWURWUVFHRXdKTldERVpNQmNHQTFVRUNBd1FRMGxWUkVGRUlFUkZJRTFGV0VsRFR6RVRNQkVHQTFVRUJ3d0tRMVZCVlVoVVJVMVBRekVWTUJNR0ExVUVMUk1NVTBGVU9UY3dOekF4VGs0ek1Wd3dXZ1lKS29aSWh2Y05BUWtDRTAxeVpYTndiMjV6WVdKc1pUb2dRVVJOU1U1SlUxUlNRVU5KVDA0Z1EwVk9WRkpCVENCRVJTQlRSVkpXU1VOSlQxTWdWRkpKUWxWVVFWSkpUMU1nUVV3Z1EwOU9WRkpKUWxWWlJVNVVSVEFlRncweE9URXlNakF5TXpNeE16RmFGdzB5TXpFeU1qQXlNek14TXpGYU1JSDZNVEF3TGdZRFZRUURFeWREUVZOQklFUkpRVm9nUkVVZ1RVRlJWVWxPUVZNZ1JFVWdRMDlUUlZJZ1UwRWdSRVVnUTFZeE1EQXVCZ05WQkNrVEowTkJVMEVnUkVsQldpQkVSU0JOUVZGVlNVNUJVeUJFUlNCRFQxTkZVaUJUUVNCRVJTQkRWakV3TUM0R0ExVUVDaE1uUTBGVFFTQkVTVUZhSUVSRklFMUJVVlZKVGtGVElFUkZJRU5QVTBWU0lGTkJJRVJGSUVOV01TVXdJd1lEVlFRdEV4eERSRTAzTmpBeE1qUkRPRFVnTHlCRVNVVkRNemt3T1RFMFUwSTBNUjR3SEFZRFZRUUZFeFVnTHlCRVNVVkRNemt3T1RFMFNFUkdXbE5PTURBeEd6QVpCZ05WQkFzVEVrTkdSRWtnUmtGRElFTkJVMEVnUkVsQldqQ0NBU0l3RFFZSktvWklodmNOQVFFQkJRQURnZ0VQQURDQ0FRb0NnZ0VCQUxBd2lJWktqVEN0VHI2KzFWWVNHMXlXRHkrVnhhL0hMUUM1cUlPRHdmYTh2SS9lbDc5N0JQemRIdVEwSXdJU0hPUFRNelRCT3NmQ09sWktweHo2LzRGK1ljazJoK2dLM2JnaXYyOWVUR0ZQSHk2b2NPZ2JrYURIdi9OeHVPUHd3ZkpaanltZmpxdHRybmllQm4xUlIvNFlYTzZBRHJpNy9kejRTcVMvLzk1RVpCNk1tZ2g1ZElKcDI1TElNREFDQmp2ei9YTUd6MldvK0tsOUhCNXQ4NzRaUFAzM1B3WEVXVVNjdXp2SklLdmtUT2x2djNtVWR2bExEMkJwckF3VU9BbG9iakVHSUEyY2Jna1gzUXRKYU9uWmFxZThiSGZ3Y3lxTmtWblA3d3cvcFdpOXBvanMvOUNoR3ZROHE0ekhTVmVmeEJBMnlFR3ZOS2lETURHVEhkY0NBd0VBQWFNZE1Cc3dEQVlEVlIwVEFRSC9CQUl3QURBTEJnTlZIUThFQkFNQ0JzQXdEUVlKS29aSWh2Y05BUUVMQlFBRGdnSUJBSitPMWhJVlJ0eVdmTGduUlJlTUZFUFV3dHF0ZWR1NzlKYnhwSTVWS3c5Ym1hYzg4SUZDWXZ6Ulp6bjdTWURkWWtjSVl5Mk14VjVwby9GRTB2NExveDJNaE53ZWMzRHNocEM5MkE2cklybGJNZzFFRjcxR2pUTXBrSFp5bHRmOGhmSm9PODFwQmNHbGdRWUlGZ3RZS3EwdnJRdUtQSHRQc3pxeWxLSE1WVWZyNVpZSHpmTVVwaWV1c0N2UVNweVlpRGlzbGt2RDUrQno1M3JtNk9ZVG9LYWJ4RS9yVkl3cWo5ZHE1WVBvOFp0amhnU0tPZlpSMFhIQklNLzAxWndkWC96N29UMkdmOVlyU2Q0alEzL3RSVEJCTHNlTzVMMHQyaDJuVEErbDNudmkxdFcyNFgwRUZEY2liNFVkS1NpZEQvUEVobWtnV2JhOTdLQjU4aXkxZlNJOW1Lam9sVk5SbmVHK0RSMlhsOENCUjNiYnRIaVNRckNxMU1Ndy9raDBmNDl5SWg4Z2N5OXpubWRwejErMnFHRUhPZDhiR2FaelhsZHkwMmExVG1RMXJFQ2JnK1Z4dUZ0S1luSVppRGdsaSs5U09pbWcwakRZaXJqT0UwZmJtTkFGbmhscXJ0RHc1cFNYV0U2WE85MlZBR2w2SFJzTlVSREU3N3QxelpNZVJ4VG5HOEVOUHkyMG9BbUdJQ1BnUVhEOE5ySHpiN1A5ZXR3VmFCaEp4Q3J6cVR0NlRNeWhmUnU3SmJGWmtrUHBkaVNpQlg2UzZNZEpTeFVyNnduRmcxRmtvMXBjYUN2MGxzV0pkaFlhZTBaMDNwckg3VGNDSXlGSmxwUkFUczhGUG9mVlUyN2pQRWNtMEUvZmlJN05wbE84UWIrUHlZK2Vsa0RBT1NieTBEU2siIFNlbGxvPSJnd2IyQ2Z3UTBLK2pjQTFBNHRFL3FOeFpQWHd0QVdEY3pwMTJxK2lHODhINXMvNktpdWtuU2NTQ3BaalB6T0UzdU9hQkUweUpzbVlrRUxleEtyRFNmTVVLWTNUNWZQU3VZcnZDcENTcmRzbVdaTnkzWTg1SDlRZmNyL1lLMWgxSlViL09PRHRwNUZHUW1TaXdNN0Z6d01qNXk1S3JXaXNQV2d1MThFczBRclBNQ012Q3lkTkhucmxiMDlXK1lpWlZlZnpYdjF5YlVrcTlOa01wa1YxRDlUQy9GZUR5WUhYWHExdWpzc01iaytCd0FvdHhYOFNtUXZJemQ5c2NqK0lWbzNDVU1XRzJlT3RnTmJWdG9PVzc4TUZCSG9zREdwWGlsN1NtWFQ1Tm0vRjFGL1pRR1NWTm9TQlZQVUcyUm00RUVYNzZldjRKL0dSZjhuK29HaXJubEE9PSI+Cgk8Y2ZkaTpFbWlzb3IgTm9tYnJlPSJDQVNBIERJQVogREUgTUFRVUlOQVMgREUgQ09TRVIsUy5BLiBERSBDVi4iIFJlZ2ltZW5GaXNjYWw9IjYwMSIgUmZjPSJDRE03NjAxMjRDODUiIC8+Cgk8Y2ZkaTpSZWNlcHRvciBSZmM9IkNETTc2MDEyNEM4NSIgTm9tYnJlPSJDQVNBIERJQVogREUgTUFRVUlOQVMgREUgQ09TRVIsUy5BLiBERSBDVi4iIFVzb0NGREk9IlAwMSIgLz4KCTxjZmRpOkNvbmNlcHRvcz4KCQk8Y2ZkaTpDb25jZXB0byBDbGF2ZVByb2RTZXJ2PSI3ODEwMTgwMiIgQ2FudGlkYWQ9IjEuMDAiIENsYXZlVW5pZGFkPSJFNDgiIFVuaWRhZD0iU0VSVklDSU8iIERlc2NyaXBjaW9uPSJUUkFTTEFETyBERSBNRVJDQU5DSUEiIFZhbG9yVW5pdGFyaW89IjAuMDAiIEltcG9ydGU9IjAuMDAiIC8+Cgk8L2NmZGk6Q29uY2VwdG9zPgoJPGNmZGk6Q29tcGxlbWVudG8+CgkJPGNhcnRhcG9ydGUyMDpDYXJ0YVBvcnRlIFZlcnNpb249IjIuMCIgVHJhbnNwSW50ZXJuYWM9Ik5vIiBUb3RhbERpc3RSZWM9IjYuMDAiPgoJCQk8Y2FydGFwb3J0ZTIwOlViaWNhY2lvbmVzPgoJCQkJPGNhcnRhcG9ydGUyMDpVYmljYWNpb24gVGlwb1ViaWNhY2lvbj0iT3JpZ2VuIiBJRFViaWNhY2lvbj0iT1IwMDAxMTEiIFJGQ1JlbWl0ZW50ZURlc3RpbmF0YXJpbz0iQ0RNNzYwMTI0Qzg1IiBOb21icmVSZW1pdGVudGVEZXN0aW5hdGFyaW89IkNBU0EgRElBWiBERSBNQVFVSU5BUyBERSBDT1NFUixTLkEuIERFIENWIiBGZWNoYUhvcmFTYWxpZGFMbGVnYWRhPSIyMDIxLTExLTMwVDEyOjAwOjAwIj4KCQkJCQk8Y2FydGFwb3J0ZTIwOkRvbWljaWxpbyBDYWxsZT0iRlJBWSBTRVJWQU5ETyBURVJFU0EgREUgTUlFUiIgTnVtZXJvRXh0ZXJpb3I9IjI5IiBDb2xvbmlhPSIwOTc0IiBMb2NhbGlkYWQ9IjA2IiBNdW5pY2lwaW89IjAxNSIgRXN0YWRvPSJESUYiIFBhaXM9Ik1FWCIgQ29kaWdvUG9zdGFsPSIwNjgwMCIgLz4KCQkJCTwvY2FydGFwb3J0ZTIwOlViaWNhY2lvbj4KCQkJCTxjYXJ0YXBvcnRlMjA6VWJpY2FjaW9uIFRpcG9VYmljYWNpb249IkRlc3Rpbm8iIElEVWJpY2FjaW9uPSJERTAwMDA2OSIgUkZDUmVtaXRlbnRlRGVzdGluYXRhcmlvPSJDRE03NjAxMjRDODUiIE5vbWJyZVJlbWl0ZW50ZURlc3RpbmF0YXJpbz0iTk9STUEgTEVDSFVHQSBBTkFZQSIgRmVjaGFIb3JhU2FsaWRhTGxlZ2FkYT0iMjAyMS0xMS0zMFQxNDowMDowMCIgRGlzdGFuY2lhUmVjb3JyaWRhPSIxLjAwIj4KCQkJCQk8Y2FydGFwb3J0ZTIwOkRvbWljaWxpbyBDYWxsZT0iQ0FMTEUgQUxMRU5ERSAgIDI3IiBDb2xvbmlhPSIyMDEyIiBNdW5pY2lwaW89IjA0MyIgRXN0YWRvPSJNRVgiIFBhaXM9Ik1FWCIgQ29kaWdvUG9zdGFsPSI1MjY4MCIgLz4KCQkJCTwvY2FydGFwb3J0ZTIwOlViaWNhY2lvbj4KCQkJCTxjYXJ0YXBvcnRlMjA6VWJpY2FjaW9uIFRpcG9VYmljYWNpb249IkRlc3Rpbm8iIElEVWJpY2FjaW9uPSJERTAwMDA3MCIgUkZDUmVtaXRlbnRlRGVzdGluYXRhcmlvPSJCTVU5NDAzMDFHSjAiIE5vbWJyZVJlbWl0ZW50ZURlc3RpbmF0YXJpbz0iQklFTlZFTklETyBBTCBNVU5ETyBTLkEuIERFIEMuVi4iIEZlY2hhSG9yYVNhbGlkYUxsZWdhZGE9IjIwMjEtMTItMDJUMTU6MDA6MDAiIERpc3RhbmNpYVJlY29ycmlkYT0iMy4wMCI+CgkJCQkJPGNhcnRhcG9ydGUyMDpEb21pY2lsaW8gQ2FsbGU9IklHTkFDSU8gQUxMRU5ERSIgTnVtZXJvRXh0ZXJpb3I9IjcvLiIgQ29sb25pYT0iMDIzOCIgTXVuaWNpcGlvPSIwMTQiIEVzdGFkbz0iUVVFIiBQYWlzPSJNRVgiIENvZGlnb1Bvc3RhbD0iNzYyMjAiIC8+CgkJCQk8L2NhcnRhcG9ydGUyMDpVYmljYWNpb24+CgkJCQk8Y2FydGFwb3J0ZTIwOlViaWNhY2lvbiBUaXBvVWJpY2FjaW9uPSJEZXN0aW5vIiBJRFViaWNhY2lvbj0iREUwMDAwNzEiIFJGQ1JlbWl0ZW50ZURlc3RpbmF0YXJpbz0iU0lUMTExMTA4Mko4IiBOb21icmVSZW1pdGVudGVEZXN0aW5hdGFyaW89IkxBIFNBUlRPUklBIElUQUxJQU5BIFMuQS4gREUgQy5WLiIgRmVjaGFIb3JhU2FsaWRhTGxlZ2FkYT0iMjAyMS0xMi0wMVQxNDowMDowMCIgRGlzdGFuY2lhUmVjb3JyaWRhPSIyLjAwIj4KCQkJCQk8Y2FydGFwb3J0ZTIwOkRvbWljaWxpbyBDYWxsZT0iQ0VOVEVOTyIgTnVtZXJvRXh0ZXJpb3I9IjY1Mi8uIiBDb2xvbmlhPSIxMjU4IiBMb2NhbGlkYWQ9IjA4IiBNdW5pY2lwaW89IjAwNiIgRXN0YWRvPSJESUYiIFBhaXM9Ik1FWCIgQ29kaWdvUG9zdGFsPSIwODQwMCIgLz4KCQkJCTwvY2FydGFwb3J0ZTIwOlViaWNhY2lvbj4KCQkJPC9jYXJ0YXBvcnRlMjA6VWJpY2FjaW9uZXM+CgkJCTxjYXJ0YXBvcnRlMjA6TWVyY2FuY2lhcyBQZXNvQnJ1dG9Ub3RhbD0iMS4wMTMiIFVuaWRhZFBlc289IktHTSIgTnVtVG90YWxNZXJjYW5jaWFzPSIyIj4KCQkJCTxjYXJ0YXBvcnRlMjA6TWVyY2FuY2lhIEJpZW5lc1RyYW5zcD0iNTMxNDE2MDAiIERlc2NyaXBjaW9uPSJTdW1pbmlzdHJvcyBkZSBjb3N0dXJhIHZhcmlhZG9zIiBDYW50aWRhZD0iMy4wMDAwMDAiIENsYXZlVW5pZGFkPSJIODciIFBlc29FbktnPSIwLjAxMyIgVmFsb3JNZXJjYW5jaWE9IjAuMDAiIE1vbmVkYT0iTVhOIiAvPgoJCQkJPGNhcnRhcG9ydGUyMDpNZXJjYW5jaWEgQmllbmVzVHJhbnNwPSI1MzE0MTYwNSIgRGVzY3JpcGNpb249IkFndWphcyBkZSBjb3N0dXJhIiBDYW50aWRhZD0iMS4wMDAwMDAiIENsYXZlVW5pZGFkPSJTRVQiIFBlc29FbktnPSIxLjAwMCIgVmFsb3JNZXJjYW5jaWE9IjAuMDAiIE1vbmVkYT0iTVhOIiAvPgoJCQkJPGNhcnRhcG9ydGUyMDpBdXRvdHJhbnNwb3J0ZSBQZXJtU0NUPSJUUEFGMDIiIE51bVBlcm1pc29TQ1Q9IjAsMSI+CgkJCQkJPGNhcnRhcG9ydGUyMDpJZGVudGlmaWNhY2lvblZlaGljdWxhciBDb25maWdWZWhpY3VsYXI9IlZMIiBQbGFjYVZNPSJZUDkwNzFBIiBBbmlvTW9kZWxvVk09IjIwMTkiIC8+CgkJCQkJPGNhcnRhcG9ydGUyMDpTZWd1cm9zIEFzZWd1cmFSZXNwQ2l2aWw9IkNIVUJCIFNFR1VST1MgTUVYSUNPIiBQb2xpemFSZXNwQ2l2aWw9IkNIVUJCIiAvPgoJCQkJCTxjYXJ0YXBvcnRlMjA6UmVtb2xxdWVzPgogICAgICAgICAgICAgICAgICAgICAgICA8Y2FydGFwb3J0ZTIwOlJlbW9scXVlIFN1YlRpcG9SZW09IkNUUjAwNCIgUGxhY2E9IlZMNDVLOTgiIC8+CiAgICAgICAgICAgICAgICAgICAgPC9jYXJ0YXBvcnRlMjA6UmVtb2xxdWVzPgoJCQkJPC9jYXJ0YXBvcnRlMjA6QXV0b3RyYW5zcG9ydGU+CgkJCTwvY2FydGFwb3J0ZTIwOk1lcmNhbmNpYXM+CgkJCTxjYXJ0YXBvcnRlMjA6RmlndXJhVHJhbnNwb3J0ZT4KICAgICAgICAgIAkJCQk8Y2FydGFwb3J0ZTIwOlRpcG9zRmlndXJhIFRpcG9GaWd1cmE9IjAxIiBSRkNGaWd1cmE9IlhBWFgwMTAxMDEwMDAiIE51bUxpY2VuY2lhPSIwMTAyMDMzOTUiIE5vbWJyZUZpZ3VyYT0iQk9HQVJUIEFOVE9OSU8gTU9MSU5BIFNBTlRBTkEiIC8+CgkJCTwvY2FydGFwb3J0ZTIwOkZpZ3VyYVRyYW5zcG9ydGU+CgkJPC9jYXJ0YXBvcnRlMjA6Q2FydGFQb3J0ZT4KCTx0ZmQ6VGltYnJlRmlzY2FsRGlnaXRhbCB4bWxuczp0ZmQ9Imh0dHA6Ly93d3cuc2F0LmdvYi5teC9UaW1icmVGaXNjYWxEaWdpdGFsIiB4c2k6c2NoZW1hTG9jYXRpb249Imh0dHA6Ly93d3cuc2F0LmdvYi5teC9UaW1icmVGaXNjYWxEaWdpdGFsIGh0dHA6Ly93d3cuc2F0LmdvYi5teC9zaXRpb19pbnRlcm5ldC9jZmQvVGltYnJlRmlzY2FsRGlnaXRhbC9UaW1icmVGaXNjYWxEaWdpdGFsdjExLnhzZCIgVmVyc2lvbj0iMS4xIiBVVUlEPSI1MzY5QUEyMC1EMzcwLTRGQ0YtQUU1Qi1CRUVBRDU3RDdFNzUiIEZlY2hhVGltYnJhZG89IjIwMjEtMTItMTdUMTY6NDQ6MjUiIFJmY1Byb3ZDZXJ0aWY9IlNGRTA4MDcxNzJXNyIgU2VsbG9DRkQ9Imd3YjJDZndRMEsramNBMUE0dEUvcU54WlBYd3RBV0RjenAxMnEraUc4OEg1cy82S2l1a25TY1NDcFpqUHpPRTN1T2FCRTB5SnNtWWtFTGV4S3JEU2ZNVUtZM1Q1ZlBTdVlydkNwQ1NyZHNtV1pOeTNZODVIOVFmY3IvWUsxaDFKVWIvT09EdHA1RkdRbVNpd003Rnp3TWo1eTVLcldpc1BXZ3UxOEVzMFFyUE1DTXZDeWROSG5ybGIwOVcrWWlaVmVmelh2MXliVWtxOU5rTXBrVjFEOVRDL0ZlRHlZSFhYcTF1anNzTWJrK0J3QW90eFg4U21Rdkl6ZDlzY2orSVZvM0NVTVdHMmVPdGdOYlZ0b09XNzhNRkJIb3NER3BYaWw3U21YVDVObS9GMUYvWlFHU1ZOb1NCVlBVRzJSbTRFRVg3NmV2NEovR1JmOG4rb0dpcm5sQT09IiBOb0NlcnRpZmljYWRvU0FUPSIyMDAwMTAwMDAwMDMwMDAyMjc3OSIgU2VsbG9TQVQ9IndTOGhkTWhoNmN4SXd3Ty9WczFUNWdldzdsV0JMR1hSb0ovdytWZnJqVE43cnNOdEsxaXR3WHQvMDk5S0hlOGpLaTR5eFRGQ2dYbGVHc2MyVlVHYlJoYW9vQVlNOG9jeitmY24zNkM3MmlFWmFJQ2Y4Wk05WEdKcjNuaVFPbWN4ek1Tay95VXNINTBuN2liZ0IvbmpmWWw1MGl0b3RpUWxTbk0wQ0ZoOFZTcUJZaEljdHZHZFNXTWFKUzRDQ1JydVZILzB5ckJUaThUN3JqQmhFbzZKM2J5Zmd6cnF3V0xNZ05YYkxzdzhCKytYeE9MK1J4Q1krRDZtdWlwaUVRY1pJR3RqTURGZ2cvVUU4ZEtYT2EvWlZzTVA4eS9MNFdUbURnQytXc3N4UWJIVW8zN3ltT1h4TWxRdnR0V3o1ME9memRxUUZEeEc4M1FRNXJuaWtuSXoxZz09IiAvPjwvY2ZkaTpDb21wbGVtZW50bz4KCjxjZmRpOkFkZGVuZGE+CjxEYXRvc0FkaWNpb25hbGVzIEVNQUlMPSJqbWxvcGV6QGNhc2FkaWF6LmJpeiIgLz4KPC9jZmRpOkFkZGVuZGE+PC9jZmRpOkNvbXByb2JhbnRlPgo="

async function getPDFCasaDiaz(docBase64, pathLogo, nameFile)
{
    var xmlString = await xml.serializeXML(docBase64)

    var options = {compact: false, ignoreComment: true, spaces: 4};
    const jsonString = convert.xml2json(xmlString, options);
    const jsonData = JSON.parse(jsonString)
    var emisor = jsonData.elements[0].elements.find( o => o.name === "cfdi:Emisor")
    var receptor = jsonData.elements[0].elements.find( o => o.name === "cfdi:Receptor")
    var attributes = jsonData.elements[0].attributes
    var complemento = jsonData.elements[0].elements.find( o => o.name === "cfdi:Complemento")
    var timbreFiscal = complemento.elements.find( o => o.name === "tfd:TimbreFiscalDigital")
    var conceptos = jsonData.elements[0].elements.find( o => o.name === "cfdi:Conceptos")
    var cartaP = complemento.elements.find( o => o.name === "cartaporte20:CartaPorte")
    //console.log(cartaP)

    var datosEmisor = {
        text: [
            {text: `${emisor.attributes.Nombre}\n`, style: 'textotablaboldlarge'},
            {text: "\n", style: 'espacios'},
            {text: `R.F.C.: ${emisor.attributes.Rfc}\n`, style: 'encabezadoRfc'},
            {text: "\n", style: 'espacios'},
            {text: "DOMICILIO FISCAL: \n", style: 'encabezadoDomicilio'},
            {text: "AQUI VA EL DOMICILIO \n", style: 'encabezadoTexto'},
            {text: "\n", style: 'espacios'},
            {text: `LUGAR DE EXPEDICIÓN: `, style: 'encabezadoDomicilio'},
            {text: `${attributes.LugarExpedicion}\n`, style: 'encabezadoTexto'},
            {text: "\n", style: 'espacios'},
            {text: `FECHA Y HORA DE EXPEDICIÓN: `, style: 'encabezadoDomicilio'},
            {text: `${attributes.Fecha}`, style: 'encabezadoTexto'},
        ]
    }

    var paramsTipoComprobante = {
        pvOptionCRUD: "R",
        pvIdCatalog: attributes.TipoDeComprobante,
        table: "SAT_Cat_Receipt_Types"
    }

    var resTipoTraslado = await dbcatcatalogs.getCatalogIdDescription(paramsTipoComprobante)

    var paramsRegimenFiscal = {
        pvOptionCRUD: "R",
        pvIdCatalog: emisor.attributes.RegimenFiscal,
        table: "SAT_Cat_Tax_Regimens"
    }

    var resRegimenFiscal = await dbcatcatalogs.getCatalogIdDescription(paramsRegimenFiscal)
    

    var encabezado =
    {
        columns: [
            [
                {text: "\n", style: 'espacios'},
                {text: "\n", style: 'espacios'},
                { image: pathLogo, width: 140, height: 60, alignment: 'center'},
                {text: "\n", style: 'espacios'},
            ],
            [
                {text: datosEmisor}
            ],
            [
                {
                    table: {
                        body: [
                            [
                                {border: [false, false, false, false], fillColor: '#eaa01b', text: 'TRASLADO', alignment: 'center', style: 'textoTablaTrasladoHeader'},
                            ],
                            [
                                {border: [true, false, true, false], text: `SERIE: ${attributes.Serie} FOLIO: ${attributes.Folio}`, style: 'textotablaboldblack',  alignment: 'left'},
                            ],
                            [
                                { border: [true, false, true, false], text: `VERSIÓN: ${attributes.Version}`, style: 'textotabla', alignment: 'left'}, 
                            ],
                            [
                                { border: [true, false, true, false], text: `FOLIO FISCAL: ${timbreFiscal.attributes.UUID}`, style: 'textotabla', alignment: 'left'},
                            ],
                            [
                                { border: [true, false, true, false], text: `FECHA Y HORA DE CERTIFICACIÓN: ${timbreFiscal.attributes.FechaTimbrado}`, style: 'textotabla', alignment: 'left'},
                            ],
                            [
                                {border: [true, false, true, false], text: `FECHA Y HORA DE EMISIÓN: ${attributes.Fecha}`, style: 'textotabla' , alignment: 'left'},
                            ],
                            [
                                {border: [true, false, true, false], text: `TIPO DE COMPROBANTE: ${attributes.TipoDeComprobante} - ${resTipoTraslado}`, style: 'textotabla' , alignment: 'left'},
                            ],
                            [
                                {border: [true, false, true, true], text: `RÉGIMEN FISCAL: ${emisor.attributes.RegimenFiscal} - ${resRegimenFiscal}`, style: 'textotabla' , alignment: 'left'},
                            ],
                        ]
                    },
                    layout: {
                        hLineWidth: function () {
                            return  0.7;
                        },
                        vLineWidth: function () {
                            return 0.7;
                        },
                        hLineColor: function () {
                            return 'gray';
                        },
                        vLineColor: function () {
                            return 'gray';
                        },
                    }	
                }
            ]
        ]
    } 

    var paramsUsoCFDI = {
        pvOptionCRUD: "R",
        pvIdCatalog: receptor.attributes.UsoCFDI,
        table: "SAT_Cat_CFDI_Uses"
    }

    var resUsoCFDI = await dbcatcatalogs.getCatalogIdDescription(paramsUsoCFDI)

    var cliente = {
        table: {
            widths: ["*", 130, 90],
            body: [
                [
                    {border: [false, false, false, false], fillColor: '#eaa01b', text: 'CLIENTE', alignment: 'center', style: 'textoTablaClienteHeader', colSpan:3},
                    {},
                    {}
                ],
                [
                    {text: `NOMBRE`, style: 'textoTablaClienteBoldblack',  alignment: 'center'},
                    {text: `R.F.C.:`, style: 'textoTablaClienteBoldblack',  alignment: 'center'},
                    {text: `USO DE CFDI:`, style: 'textoTablaClienteBoldblack',  alignment: 'center'},
                ],
                [
                    {text: `${receptor.attributes.Nombre}`, style: 'textoTablaCliente', alignment: 'center'}, 
                    {text: `${receptor.attributes.Rfc}`, style: 'textoTablaCliente', alignment: 'center'}, 
                    {text: `${receptor.attributes.UsoCFDI} - ${resUsoCFDI}`, style: 'textoTablaCliente', alignment: 'center'}, 
                ],
            ]
        },
        layout: {
            hLineWidth: function () {
                return  0.7;
            },
            vLineWidth: function () {
                return 0.7;
            },
            hLineColor: function () {
                return 'gray';
            },
            vLineColor: function () {
                return 'gray';
            },
        }	
    }

    var conceptosArray = []
    var cCount = 0

    conceptosArray[cCount] = [
        {border: [false, false, false, false], fillColor: '#eaa01b', text: 'Clave Producto / Servicio', alignment: 'center', style: 'textoTablaTrasladoHeader'},
        {border: [false, false, false, false], fillColor: '#eaa01b', text: 'Cantidad', alignment: 'center', style: 'textoTablaTrasladoHeader'},
        {border: [false, false, false, false], fillColor: '#eaa01b', text: 'Clave Unidad', alignment: 'center', style: 'textoTablaTrasladoHeader'},
        {border: [false, false, false, false], fillColor: '#eaa01b', text: 'Unidad', alignment: 'center', style: 'textoTablaTrasladoHeader'},
        {border: [false, false, false, false], fillColor: '#eaa01b', text: 'Descripción', alignment: 'center', style: 'textoTablaTrasladoHeader'},
        {border: [false, false, false, false], fillColor: '#eaa01b', text: 'Valor Unitario', alignment: 'center', style: 'textoTablaTrasladoHeader'},
        {border: [false, false, false, false], fillColor: '#eaa01b', text: 'Importe', alignment: 'center', style: 'textoTablaTrasladoHeader'},
    ]

    cCount++

    for(var i=0; i<conceptos.elements.length; i++)
    {
        var paramsClaveUnidad= {
            pvOptionCRUD: "R",
            pvIdCatalog: conceptos.elements[i].attributes.ClaveUnidad,
            table: "SAT_Cat_UoM_Codes"
        }
    
        var resClaveUnidad = await dbcatcatalogs.getCatalogIdDescription(paramsClaveUnidad)

        var paramsClaveProd= {
            pvOptionCRUD: "R",
            pvIdCatalog: conceptos.elements[i].attributes.ClaveProdServ,
            table: "SAT_Cat_Product_Service_Codes"
        }
    
        var resClaveProd = await dbcatcatalogs.getCatalogIdDescription(paramsClaveProd)

        conceptosArray[cCount] = [
            {text: `${conceptos.elements[i].attributes.ClaveProdServ} - ${resClaveProd}`, alignment: 'center', style: 'textoTablaCliente'},
            {text: `${conceptos.elements[i].attributes.Cantidad}`, alignment: 'center', style: 'textoTablaCliente'},
            {text: `${conceptos.elements[i].attributes.ClaveUnidad} - ${resClaveUnidad}`, alignment: 'center', style: 'textoTablaCliente'},
            {text: `${conceptos.elements[i].attributes.Unidad}`, alignment: 'center', style: 'textoTablaCliente'},
            {text: `${conceptos.elements[i].attributes.Descripcion}`, alignment: 'left', style: 'textoTablaCliente'},
            {text: `${conceptos.elements[i].attributes.ValorUnitario}`, alignment: 'center', style: 'textoTablaCliente'},
            {text: `${conceptos.elements[i].attributes.Importe}`, alignment: 'center', style: 'textoTablaCliente'},
        ]
        cCount++
    }

    var conceptos = {
        table: {
            headerRows: 1,
            widths: [80, 40, 50, 60, "*", 60, 40],
            body: conceptosArray
        },
        layout: {
            hLineWidth: function () {
                return  0.7;
            },
            vLineWidth: function () {
                return 0.7;
            },
            hLineColor: function () {
                return 'gray';
            },
            vLineColor: function () {
                return 'gray';
            },
        }	
    }

    var paramsMoneda= {
        pvOptionCRUD: "R",
        pvIdCatalog: attributes.Moneda,
        table: "SAT_Cat_Currencies"
    }

    var resMoneda = await dbcatcatalogs.getCatalogIdDescription(paramsMoneda)

    var totales = 
    {
        columns: [
            {
                width: "*",
                text: `Moneda: ${attributes.Moneda} - ${resMoneda}`,
                style: 'moneda'
            },
            {
                width: 200,
                table: {
                    widths: ["*", 50],
                    body: [
                        [
                            {text: 'SUBTOTAL', alignment: 'right', style: 'textotablabold'},
                            {text: `${attributes.SubTotal}`, alignment: 'right', style: 'textotablabold'},
                        ],
                        [
                            {border: [false, false, false, false], fillColor: '#eaa01b', text: 'TOTAL', alignment: 'right', style: 'textoTablaTrasladoHeader'},
                            {border: [false, false, false, false], fillColor: '#eaa01b', text: `${attributes.Total}`, alignment: 'right', style: 'textoTablaTrasladoHeader'},
                        ],
                    ]
                },
                layout: {
                    hLineWidth: function () {
                        return  0.7;
                    },
                    vLineWidth: function () {
                        return 0.7;
                    },
                    hLineColor: function () {
                        return 'gray';
                    },
                    vLineColor: function () {
                        return 'gray';
                    },
                }	
            },
        ]
    }

    //Se arma la CADENA ORIGINAL DEL COMPLEMENTO DE CERTIFICACIÓN DIGITAL DEL SAT
    var version = timbreFiscal.attributes.Version 
    if(version === undefined)
    {
        version = ""
    }
    else {
        version = version + "|"
    }

    var uuid = timbreFiscal.attributes.UUID
    if(uuid === undefined)
    {
        uuid = ""
    }
    else {
        uuid = uuid + "|"
    }

    var fechaTimbrado = timbreFiscal.attributes.FechaTimbrado
    if(fechaTimbrado === undefined)
    {
        fechaTimbrado = ""
    }
    else {
        fechaTimbrado = fechaTimbrado + "|"
    }

    var rfcProvCertif = timbreFiscal.attributes.RfcProvCertif
    if(rfcProvCertif === undefined)
    {
        rfcProvCertif = ""
    }
    else{ 
        rfcProvCertif = rfcProvCertif + "|"
    }

    var selloCFD = timbreFiscal.attributes.SelloCFD
    if(selloCFD === undefined)
    {
        selloCFD = ""
    }
    else {
        selloCFD = selloCFD + "|"
    }

    var noCertificadoSAT = timbreFiscal.attributes.NoCertificadoSAT 
    if(noCertificadoSAT == undefined)
    {
        noCertificadoSAT = ""
    }
    
    var complementoCertificacionSAT = "||" + version + uuid + fechaTimbrado + rfcProvCertif + selloCFD + noCertificadoSAT + "||"

    var cadenaCodigo = {
        text: [
            {text: "NÚMERO DE SERIE DEL CERTIFICADO DEL SAT: ", style: 'textoTablaCodigoBold'},
            {text: `${timbreFiscal.attributes.NoCertificadoSAT}\n`, style: 'textoTablaCodigo'},
            {text: "\n", style: 'espacios'},
            {text: "NÚMERO DE SERIE DEL CSD DEL EMISOR: ", style: 'textoTablaCodigoBold'},
            {text: `${attributes.NoCertificado}\n`, style: 'textoTablaCodigo'},
            {text: "\n", style: 'espacios'},
            {text: "SELLO DIGITAL DEL SAT:\n", style: 'textoTablaCodigoBold'},
            {text: `${timbreFiscal.attributes.SelloSAT}\n`, style: 'textoTablaCodigo'},
            {text: "\n", style: 'espacios'},
            {text: "SELLO DIGITAL DEL CFDI:\n", style: 'textoTablaCodigoBold'},
            {text: `${timbreFiscal.attributes.SelloCFD}\n`, style: 'textoTablaCodigo'},
            {text: "\n", style: 'espacios'},
            {text: "CADENA ORIGINAL DEL COMPLEMENTO DE CERTIFICACIÓN DIGITAL DEL SAT:\n", style: 'textoTablaCodigoBold'},
            {text: `${complementoCertificacionSAT}\n`, style: 'textoTablaCodigo'},
        ]
    }

    //Se arma el url para el código QR
    var finSelloDig = timbreFiscal.attributes.SelloCFD.substr(-8);
    var url = "https://verificacfdi.facturaelectronica.sat.gob.mx/default.aspx" + "?&id=" +
                timbreFiscal.attributes.UUID + "&re=" + emisor.attributes.Rfc + "&rr=" + receptor.attributes.Rfc + "&tt=" + attributes.Total  + "&fe=" + finSelloDig

    var paramsTemporalFiles = {
        pvOptionCRUD: "R",
        piIdParameter: "20",
    }

    var resTemporalFiles = await dbcatgeneralparameters.getGeneralParametersbyID(paramsTemporalFiles)
    console.log((resTemporalFiles[0])[0].Value)

    var imageQR = timbreFiscal.attributes.UUID + ".png"
    //console.log(imageQR)

    const buffer = await new AwesomeQR({
        text: url,
        size: 500,
    }).draw();

    var temporalFilesPath = (resTemporalFiles[0])[0].Value
      
    fs.writeFileSync(temporalFilesPath + imageQR, buffer);
    
    var codigos = {
        table: {
            widths: [110, 430],
            body: [
                [
                    {image: temporalFilesPath + imageQR, width: 120, height: 120, alignment: 'center', verticalAlign: 'middle'},
                    {border: [false, true, true, true], text: cadenaCodigo, alignment: 'left'},
                ],
            ]
        },
        layout: {
            hLineWidth: function () {
                return  0.7;
            },
            vLineWidth: function () {
                return 0.7;
            },
            hLineColor: function () {
                return 'gray';
            },
            vLineColor: function () {
                return 'gray';
            },
        }	
    }

    var cartaPorte = {
        table: {
            dontBreakRows: true, 
            widths: [170, "*", 170],
                    body: [
                        [
                            {border: [false, false, false, false], fillColor: '#eaa01b', text: 'COMPLEMENTO CARTA PORTE ' + cartaP.attributes.Version, alignment: 'center', style: 'textoTablaTrasladoHeader', colSpan:3},
                            {},
                            {},
                        ],
                        [
                            {text: 'VERSIÓN', alignment: 'center', style: 'textoTablaClienteBoldblack'},
                            {text: "TRANSPORTE INTERNACIONAL", alignment: 'center', style: 'textoTablaClienteBoldblack'},
                            {text: "TOTAL DE DISTANCIA RECORRIDA", alignment: 'center', style: 'textoTablaClienteBoldblack'},
                        ],
                        [
                            {text: cartaP.attributes.Version, alignment: 'center', style: 'textoTablaCliente'},
                            {text: cartaP.attributes.TranspInternac, alignment: 'center', style: 'textoTablaCliente'},
                            {text: cartaP.attributes.TotalDistRec, alignment: 'center', style: 'textoTablaCliente'},
                        ]
                    ]
        },
        layout: {
            hLineWidth: function () {
                return  0.7;
            },
            vLineWidth: function () {
                return 0.7;
            },
            hLineColor: function () {
                return 'gray';
            },
            vLineColor: function () {
                return 'gray';
            },
        }	
    }

    var ubicacionesCP = cartaP.elements.find( o => o.name === "cartaporte20:Ubicaciones")

    var ubicacionesArray = []
    var uCount = 0

    ubicacionesArray[uCount] = [
        {border: [false, false, false, false], fillColor: '#eaa01b', text: 'UBICACIONES', alignment: 'center', style: 'textoTablaTrasladoHeader', colSpan:7},
        {},
        {},
        {},
        {},
        {},
        {},
    ]

    uCount++

    ubicacionesArray[uCount] = [
        {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
        {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
        {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
        {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
        {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
        {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
        {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
    ]
    
    uCount++ 

    for(var i=0; i<ubicacionesCP.elements.length; i++)
    {
        //console.log(ubicacionesCP.elements[i].elements[0].attributes)
        var noC = i+1
        if(ubicacionesCP.elements[i].attributes.TipoUbicacion === "Origen")
        {
            ubicacionesArray[uCount] = [
                {border: [false, false, false, true], fillColor: '#eaa01b', text: 'UBICACIÓN ' + noC, alignment: 'center', style: 'textoTablaTrasladoHeader', colSpan:7},
                {},
                {},
                {},
                {},
                {},
                {},
            ]
        
            uCount++
    
            ubicacionesArray[uCount] = [
                {border: [false, false, false, false], fillColor: '#eaa01b', text: 'TIPO DE UBICACIÓN', alignment: 'center', style: 'textotablacolor'},
                {border: [false, false, false, false], fillColor: '#eaa01b', text: 'ID DE UBICACIÓN', alignment: 'center', style: 'textotablacolor'},
                {border: [false, false, false, false], fillColor: '#eaa01b', text: 'RFC REMITENTE', alignment: 'center', style: 'textotablacolor'},
                {border: [false, false, false, false], fillColor: '#eaa01b', text: 'NOMBRE DEL REMITENTE O DESTINATARIO', alignment: 'center', style: 'textotablacolor'},
                {border: [false, false, false, false], fillColor: '#eaa01b', text: 'FECHA Y HORA DE SALIDA O DE LLEGADA', alignment: 'center', style: 'textotablacolor'},
                {border: [false, false, false, false], fillColor: '#eaa01b', text: 'DISTANCIA RECORRIDA', alignment: 'center', style: 'textotablacolor'},
                {border: [false, false, false, false], fillColor: '#eaa01b', text: 'DOMICILIO', alignment: 'center', style: 'textotablacolor'},
            ]
        
            uCount++

            var calle = ubicacionesCP.elements[i].elements[0].attributes.Calle
            if(calle === undefined)
            {
                calle = ""
            }

            var noExterior = ubicacionesCP.elements[i].elements[0].attributes.NumeroExterior;
            if(noExterior === undefined)
            {
                noExterior = ""
            }

            var noInterior = ubicacionesCP.elements[i].elements[0].attributes.NumeroInterior;
            if(noInterior === undefined)
            {
                noInterior = ""
            }

            var referencia = ubicacionesCP.elements[i].elements[0].attributes.Referencia;
            if(referencia === undefined)
            {
                referencia = ""
            }

            var estado = ubicacionesCP.elements[i].elements[0].attributes.Estado;
            if(estado === undefined)
            {
                estado = ""
            }

            var pais = ubicacionesCP.elements[i].elements[0].attributes.Pais;
            if(pais === undefined)
            {
                pais = ""
            }

            var codigoPostal = ubicacionesCP.elements[i].elements[0].attributes.CodigoPostal;
            if(codigoPostal === undefined)
            {
                codigoPostal = ""
            }

            var colonia = ubicacionesCP.elements[i].elements[0].attributes.Colonia;
            var localidad;
            var municipio;
            if(colonia === undefined)
            {
                colonia = ""
            }
            else {
                const params = {
                    pvIdState: estado,
                    pvIdCounty : colonia,
                }
                console.log(params)
                const res = await dbcatcatalogs.getUbicZipCodeCounty(params)
                
                colonia = "(" + colonia + ") " + (res[0])[0].Description

                var localidad = ubicacionesCP.elements[i].elements[0].attributes.Localidad;
                if(localidad === undefined)
                {
                    localidad = ""
                }
                else {
                    localidad = "(" + localidad + ") " + (res[0])[0].Location_Desc
                }

                var municipio = ubicacionesCP.elements[i].elements[0].attributes.Municipio;
                if(municipio === undefined)
                {
                    municipio = ""
                }
                else {
                    municipio = "(" + municipio + ") " + (res[0])[0].Municipality_Desc
                }
            }

            var domicilio = calle + " " + noExterior + " " + noInterior + " " +  "Col. " + colonia + ", " + localidad + ", " + referencia + municipio + ", " + estado + ", " + pais  + ", " + "C.P. " + codigoPostal
    
            ubicacionesArray[uCount] = [
                {text: `${ubicacionesCP.elements[i].attributes.TipoUbicacion}`, alignment: 'center', style: 'ubicacionesTexto'},
                {text: `${ubicacionesCP.elements[i].attributes.IDUbicacion}`, alignment: 'center', style: 'ubicacionesTexto'},
                {text: `${ubicacionesCP.elements[i].attributes.RFCRemitenteDestinatario}`, alignment: 'center', style: 'ubicacionesTexto'},
                {text: `${ubicacionesCP.elements[i].attributes.NombreRemitenteDestinatario}`, alignment: 'center', style: 'ubicacionesTexto'},
                {text: `${ubicacionesCP.elements[i].attributes.FechaHoraSalidaLlegada}`, alignment: 'left', style: 'ubicacionesTexto'},
                {text: "0", alignment: 'center', style: 'ubicacionesTexto'},
                {text: domicilio, alignment: 'center', style: 'ubicacionesTexto'},
            ]
    
            uCount++ 

            ubicacionesArray[uCount] = [
                {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
            ]

            uCount++ 
        }
        else 
        {
            ubicacionesArray[uCount] = [
                {border: [false, false, false, true], fillColor: '#eaa01b', text: 'UBICACIÓN ' + noC, alignment: 'center', style: 'textoTablaTrasladoHeader', colSpan:7},
                {},
                {},
                {},
                {},
                {},
                {},
            ]
        
            uCount++
    
            ubicacionesArray[uCount] = [
                {border: [false, false, false, false], fillColor: '#eaa01b', text: 'TIPO DE UBICACIÓN', alignment: 'center', style: 'textotablacolor'},
                {border: [false, false, false, false], fillColor: '#eaa01b', text: 'ID DE UBICACIÓN', alignment: 'center', style: 'textotablacolor'},
                {border: [false, false, false, false], fillColor: '#eaa01b', text: 'RFC REMITENTE', alignment: 'center', style: 'textotablacolor'},
                {border: [false, false, false, false], fillColor: '#eaa01b', text: 'NOMBRE DEL REMITENTE O DESTINATARIO', alignment: 'center', style: 'textotablacolor'},
                {border: [false, false, false, false], fillColor: '#eaa01b', text: 'FECHA Y HORA DE SALIDA O DE LLEGADA', alignment: 'center', style: 'textotablacolor'},
                {border: [false, false, false, false], fillColor: '#eaa01b', text: 'DISTANCIA RECORRIDA', alignment: 'center', style: 'textotablacolor'},
                {border: [false, false, false, false], fillColor: '#eaa01b', text: 'DOMICILIO', alignment: 'center', style: 'textotablacolor'},
            ]
        
            uCount++

            var calle = ubicacionesCP.elements[i].elements[0].attributes.Calle
            if(calle === undefined)
            {
                calle = ""
            }

            var noExterior = ubicacionesCP.elements[i].elements[0].attributes.NumeroExterior;
            if(noExterior === undefined)
            {
                noExterior = ""
            }

            var noInterior = ubicacionesCP.elements[i].elements[0].attributes.NumeroInterior;
            if(noInterior === undefined)
            {
                noInterior = ""
            }

            var referencia = ubicacionesCP.elements[i].elements[0].attributes.Referencia;
            if(referencia === undefined)
            {
                referencia = ""
            }

            var estado = ubicacionesCP.elements[i].elements[0].attributes.Estado;
            console.log(estado)
            if(estado === undefined)
            {
                estado = ""
            }

            var pais = ubicacionesCP.elements[i].elements[0].attributes.Pais;
            if(pais === undefined)
            {
                pais = ""
            }

            var codigoPostal = ubicacionesCP.elements[i].elements[0].attributes.CodigoPostal;
            if(codigoPostal === undefined)
            {
                codigoPostal = ""
            }

            var colonia = ubicacionesCP.elements[i].elements[0].attributes.Colonia;
            var localidad;
            var municipio;
            if(colonia === undefined)
            {
                colonia = ""
            }
            else {
                const params = {
                    pvIdState: estado,
                    pvIdCounty : colonia,
                }
                console.log(params)
                const res = await dbcatcatalogs.getUbicZipCodeCounty(params)
                
                colonia = "(" + colonia + ") " + (res[0])[0].Description

                var localidad = ubicacionesCP.elements[i].elements[0].attributes.Localidad;
                if(localidad === undefined)
                {
                    localidad = ""
                }
                else {
                    localidad = "(" + localidad + ") " + (res[0])[0].Location_Desc
                }

                var municipio = ubicacionesCP.elements[i].elements[0].attributes.Municipio;
                if(municipio === undefined)
                {
                    municipio = ""
                }
                else {
                    municipio = "(" + municipio + ") " + (res[0])[0].Municipality_Desc
                }
            }

            var domicilio = calle + " " + noExterior + " " + noInterior + " " +  "Col. " + colonia + ", " + localidad + ", " + referencia + municipio + ", " + estado + ", " + pais  + ", " + "C.P. " + codigoPostal
    
            ubicacionesArray[uCount] = [
                {text: `${ubicacionesCP.elements[i].attributes.TipoUbicacion}`, alignment: 'center', style: 'ubicacionesTexto'},
                {text: `${ubicacionesCP.elements[i].attributes.IDUbicacion}`, alignment: 'center', style: 'ubicacionesTexto'},
                {text: `${ubicacionesCP.elements[i].attributes.RFCRemitenteDestinatario}`, alignment: 'center', style: 'ubicacionesTexto'},
                {text: `${ubicacionesCP.elements[i].attributes.NombreRemitenteDestinatario}`, alignment: 'center', style: 'ubicacionesTexto'},
                {text: `${ubicacionesCP.elements[i].attributes.FechaHoraSalidaLlegada}`, alignment: 'left', style: 'ubicacionesTexto'},
                {text: `${ubicacionesCP.elements[i].attributes.DistanciaRecorrida}`, alignment: 'center', style: 'ubicacionesTexto'},
                {text: domicilio, alignment: 'center', style: 'ubicacionesTexto'},
            ]
    
            uCount++

            ubicacionesArray[uCount] = [
                {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
                {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
            ]
        
            uCount++
        }
    }

    var ubicaciones = {
        table: {
            dontBreakRows: true, 
            headerRows: 1,
            widths: [40, 50, 50, 80, 60, 50, "*"],
            body: ubicacionesArray
        },
        layout: {
            hLineWidth: function () {
                return  0.7;
            },
            vLineWidth: function () {
                return 0.7;
            },
            hLineColor: function () {
                return 'gray';
            },
            vLineColor: function () {
                return 'gray';
            },
        }	
    }

    var mercanciasCP = cartaP.elements.find( o => o.name === "cartaporte20:Mercancias")

    //console.log(mercanciasCP)

    var mercanciasEncabezado = {
        table: {
            headerRows: 3,
            widths: [120, 120, "*"],
            body: [
                [
                    {border: [false, false, false, false], fillColor: '#eaa01b', text: 'MERCANCÍAS', alignment: 'center', style: 'textoTablaTrasladoHeader', colSpan:3},
                    {},
                    {},
                ],
                [
                    {text: 'PESO BRUTO TOTAL', alignment: 'center', style: 'textoTablaClienteBoldblack'},
                    {text: "UNIDAD DE PESO", alignment: 'center', style: 'textoTablaClienteBoldblack'},
                    {text: "NÚMERO TOTAL DE MERCANCÍAS", alignment: 'center', style: 'textoTablaClienteBoldblack'},
                ],
                [
                    {text: mercanciasCP.attributes.PesoBrutoTotal, alignment: 'center', style: 'textoTablaCliente'},
                    {text: mercanciasCP.attributes.UnidadPeso, alignment: 'center', style: 'textoTablaCliente'},
                    {text: mercanciasCP.attributes.NumTotalMercancias, alignment: 'center', style: 'textoTablaCliente'},
                ]
            ]
        },
        layout: {
            hLineWidth: function () {
                return  0.7;
            },
            vLineWidth: function () {
                return 0.7;
            },
            hLineColor: function () {
                return 'gray';
            },
            vLineColor: function () {
                return 'gray';
            },
        }	
    }

    var mercanciasArray = []
    var mCount = 0

    //Para guardar solo las mercancias
    var mercanciasAux = []
    var mAuxC = 0
    for(var y=0; y< mercanciasCP.elements.length; y++)
    {
        if(mercanciasCP.elements[y].name === "cartaporte20:Mercancia")
        {
            mercanciasAux[mAuxC] = mercanciasCP.elements[y]
            mAuxC++
        }
    }

    for(var i=0; i<mercanciasAux.length; i++)
    {
        var noC = i+1
        mercanciasArray[mCount] = [
            {fillColor: '#eaa01b', text: 'MERCANCÍA ' + noC, alignment: 'center', style: 'textoTablaTrasladoHeader', colSpan:7},
            {},
            {},
            {},
            {},
            {},
            {},
        ]
    
        mCount++

        mercanciasArray[mCount] = [
            {fillColor: '#eaa01b', text: 'BIENES TRANSPORTADOS', alignment: 'center', style: 'textotablacolor'},
            {fillColor: '#eaa01b', text: 'DESCRIPCIÓN', alignment: 'center', style: 'textotablacolor'},
            {fillColor: '#eaa01b', text: 'CANTIDAD', alignment: 'center', style: 'textotablacolor'},
            {fillColor: '#eaa01b', text: 'CLAVE UNIDAD', alignment: 'center', style: 'textotablacolor'},
            {fillColor: '#eaa01b', text: 'PESO EN KILOGRAMOS', alignment: 'center', style: 'textotablacolor'},
            {fillColor: '#eaa01b', text: 'VALOR DE LA MERCANCÍA', alignment: 'center', style: 'textotablacolor'},
            {fillColor: '#eaa01b', text: 'MONEDA', alignment: 'center', style: 'textotablacolor'},
        ]
    
        mCount++

        var paramsBienesTransportados= {
            pvOptionCRUD: "R",
            pvIdCatalog: mercanciasAux[i].attributes.BienesTransp,
            table: "SAT_Cat_Product_Service_Codes"
        }
    
        var resBienesTransportados = await dbcatcatalogs.getCatalogIdDescription(paramsBienesTransportados)

        mercanciasArray[mCount] = [
            {text: `${mercanciasAux[i].attributes.BienesTransp} - ${resBienesTransportados}`, alignment: 'center', style: 'ubicacionesTexto'},
            {text: `${mercanciasAux[i].attributes.Descripcion}`, alignment: 'left', style: 'ubicacionesTexto'},
            {text: `${mercanciasAux[i].attributes.Cantidad}`, alignment: 'center', style: 'ubicacionesTexto'},
            {text: `${mercanciasAux[i].attributes.ClaveUnidad}`, alignment: 'center', style: 'ubicacionesTexto'},
            {text: `${mercanciasAux[i].attributes.PesoEnKg}`, alignment: 'center', style: 'ubicacionesTexto'},
            {text: `${mercanciasAux[i].attributes.ValorMercancia}`, alignment: 'center', style: 'ubicacionesTexto'},
            {text: `${mercanciasAux[i].attributes.Moneda}`, alignment: 'center', style: 'ubicacionesTexto'},
        ]

        mCount++

        mercanciasArray[mCount] = [
            {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
            {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
            {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
            {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
            {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
            {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
            {border: [false, false, false, false], text: "", style: 'textoTablaTrasladoHeader'},
        ]
    
        mCount++
    }

    var mercancias = {
        table: {
            headerRows: 3,
            widths: [70, "*", 50, 60, 60, 50, 50],
            body: mercanciasArray
        },
        layout: {
            hLineWidth: function () {
                return  0.7;
            },
            vLineWidth: function () {
                return 0.7;
            },
            hLineColor: function () {
                return 'gray';
            },
            vLineColor: function () {
                return 'gray';
            },
        }	
    }

    var autotransporteAux = []
    var mAuxT = 0
    for(var y=0; y< mercanciasCP.elements.length; y++)
    {
        if(mercanciasCP.elements[y].name === "cartaporte20:Autotransporte")
        {
            autotransporteAux[mAuxT] = mercanciasCP.elements[y]
            mAuxT++
        }
    }

    var autotransporte = {
        table: {
            headerRows: 3,
            widths: [265, "*"],
            body: [
                [
                    {border: [false, false, false, false], fillColor: '#eaa01b', text: 'AUTOTRANSPORTE', alignment: 'center', style: 'textoTablaTrasladoHeader', colSpan:2},
                    {},
                ],
                [
                    {text: 'PERMISO SCT', alignment: 'center', style: 'textoTablaClienteBoldblack'},
                    {text: "NÚMERO DE PERMISO", alignment: 'center', style: 'textoTablaClienteBoldblack'},
                ],
                [
                    {border: [true, false, false, false], text: autotransporteAux[0].attributes.PermSCT, alignment: 'center', style: 'textoTablaCliente'},
                    {border: [true, false, true, false], text: autotransporteAux[0].attributes.NumPermisoSCT, alignment: 'center', style: 'textoTablaCliente'},
                ]
            ]
        },
        layout: {
            hLineWidth: function () {
                return  0.7;
            },
            vLineWidth: function () {
                return 0.7;
            },
            hLineColor: function () {
                return 'gray';
            },
            vLineColor: function () {
                return 'gray';
            },
        }	
    }

    //console.log(autotransporteAux[0].elements)

    var identificacionVehicularCP = autotransporteAux[0].elements.find( o => o.name === "cartaporte20:IdentificacionVehicular")
    //console.log(identificacionVehicularCP)

    var identificacionVehicular = {
        table: {
            headerRows: 3,
            widths: [150, "*", 150],
            body: [
                [
                    {border: [false, false, false, false], fillColor: '#eaa01b', text: 'IDENTIFICACIÓN VEHICULAR', alignment: 'center', style: 'textoTablaTrasladoHeader', colSpan:3},
                    {},
                    {},
                ],
                [
                    {text: 'CONFIGURACIÓN VEHICULAR', alignment: 'center', style: 'textoTablaClienteBoldblack'},
                    {text: "PLACA VEHÍCULO MOTOR", alignment: 'center', style: 'textoTablaClienteBoldblack'},
                    {text: "AÑO MODELO", alignment: 'center', style: 'textoTablaClienteBoldblack'},
                ],
                [
                    {border: [true, false, false, false], text: identificacionVehicularCP.attributes.ConfigVehicular, alignment: 'center', style: 'textoTablaCliente'},
                    {border: [true, false, true, false], text: identificacionVehicularCP.attributes.PlacaVM, alignment: 'center', style: 'textoTablaCliente'},
                    {border: [true, false, true, false], text: identificacionVehicularCP.attributes.AnioModeloVM, alignment: 'center', style: 'textoTablaCliente'},
                ]
            ]
        },
        layout: {
            hLineWidth: function () {
                return  0.7;
            },
            vLineWidth: function () {
                return 0.7;
            },
            hLineColor: function () {
                return 'gray';
            },
            vLineColor: function () {
                return 'gray';
            },
        }	
    }

    var segurosCP = autotransporteAux[0].elements.find( o => o.name === "cartaporte20:Seguros")
    //console.log(segurosCP)

    var seguros = {
        table: {
            headerRows: 3,
            widths: ["*", 60, 60, 60, 60, 60, 60],
            body: [
                [
                    {border: [false, false, false, false], fillColor: '#eaa01b', text: 'SEGUROS', alignment: 'center', style: 'textoTablaTrasladoHeader', colSpan:7},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                ],
                [
                    {text: 'ASEGURADORA DE RESPONSABILIDAD CIVIL', alignment: 'center', style: 'textoTablaClienteBoldblack2'},
                    {text: "NÚMERO DE PÓLIZA DE SEGURO POR RESPONSABILIDAD CIVIL", alignment: 'center', style: 'textoTablaClienteBoldblack2'},
                    {text: "ASEGURADORA DE MEDIO AMBIENTE", alignment: 'center', style: 'textoTablaClienteBoldblack2'},
                    {text: "NÚMERO DE PÓLIZA DE SEGURO POR MEDIO AMBIENTE", alignment: 'center', style: 'textoTablaClienteBoldblack2'},
                    {text: "ASEGURADORA DE LA CARGA TRANSPORTADA", alignment: 'center', style: 'textoTablaClienteBoldblack2'},
                    {text: "NÚMERO DE PÓLIZA DE LA CARGA TRANSPORTADA", alignment: 'center', style: 'textoTablaClienteBoldblack2'},
                    {text: "VALOR DE LA PRIMA DEL SEGURO", alignment: 'center', style: 'textoTablaClienteBoldblack2'},
                ],
                [
                    {text: segurosCP.attributes.AseguraRespCivil, alignment: 'center', style: 'textoTablaCliente'},
                    {text: segurosCP.attributes.PolizaRespCivil, alignment: 'center', style: 'textoTablaCliente'},
                    {text: segurosCP.attributes.AseguraMedAmbiente, alignment: 'center', style: 'textoTablaCliente'},
                    {text: segurosCP.attributes.PolizaMedAmbiente, alignment: 'center', style: 'textoTablaCliente'},
                    {text: segurosCP.attributes.AseguraCarga, alignment: 'center', style: 'textoTablaCliente'},
                    {text: segurosCP.attributes.PolizaCarga, alignment: 'center', style: 'textoTablaCliente'},
                    {text: segurosCP.attributes.PrimaSeguro, alignment: 'center', style: 'textoTablaCliente'},
                ]
            ]
        },
        layout: {
            hLineWidth: function () {
                return  0.7;
            },
            vLineWidth: function () {
                return 0.7;
            },
            hLineColor: function () {
                return 'gray';
            },
            vLineColor: function () {
                return 'gray';
            },
        }	
    }

    var docDefinition = {
        pageMargins: [ 20, 30, 20, 50 ],
        footer: function(currentPage, pageCount) {
            return {
                margin: [ 30, 0, 30, 30 ],
                columns: [
                    {
                        text: 'ESTE DOCUMENTO ES UNA REPRESENTACIÓN IMPRESA DE UN CFDI 3.3\n CFDI emitido por Garantía Total en Consultoría Tecnológica Avanzada S.A. de C.V. Proveedor Autorizado de Certificación (PAC) 55270\n www.gtcta.mx', style: 'footer', alignment: 'left'
                    },
                    {
                        text: 'Página ' + currentPage.toString() + ' de ' + pageCount, style: 'footer', alignment: 'right'
                    },
                ]
            }
        },
        content: [
            encabezado,
            "\n",
            cliente, 
            "\n",
            conceptos,
            "\n",
            totales,
            "\n",
            codigos,
            "\n",
            cartaPorte,
            "\n",
            ubicaciones,
            "\n",
            mercanciasEncabezado,
            mercancias,
            "\n",
            autotransporte,
            identificacionVehicular,
            seguros
            
        ],
        pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
            return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
        },
        styles: {
            encabezadoRfc: {
                fontSize: 10,
                bold: true,
                color: '#bd8635',
            },
            encabezadoDomicilio: {
                fontSize: 7,
                bold: true,
                color: '#bd8635',
            },
            encabezadoTexto: {
                fontSize: 7,
            },
            textoTablaTrasladoHeader: {
                fontSize: 8,
                color: '#ffffff',
                bold: true,
            },
            textoTablaClienteHeader: {
                fontSize: 11,
                color: '#ffffff',
                bold: true,
            },
            textoTablaClienteBoldblack: {
                fontSize: 9,
                bold: true,
                color: '#000000',
            },
            textoTablaClienteBoldblack2: {
                fontSize: 6,
                bold: true,
                color: '#000000',
            },
            textoTablaCliente: {
                fontSize: 8,
            },
            textoTablaCodigo: {
                fontSize: 6,
            },
            textoTablaCodigoBold: {
                fontSize: 6,
                bold: true,
            },
            espacios: {
                fontSize: 5,
            },
            moneda: {
                fontSize: 8,
            },
            ubicacionesTexto: {
                fontSize: 6,
            },
            header: {
                fontSize: 15,
                bold: true,
                color: '#d82b26',
            },
            index: {
                fontSize: 11,
                color: '#d82b26',
            },
            indexbackground: {
                fontSize: 11,
                color: '#d82b26',
                bold: true,
                background: '#eaa01b'
            },
            subheader: {
                fontSize: 13,
                bold: true,
                color: '#d82b26',
            },
            textosubrayado: {
                fontSize: 9,
            },
            textolista: {
                fontSize: 7,
            },
            textolista2: {
                fontSize: 8,
            },
            textotabla: {
                fontSize: 6.5,
            },
            textotablabold: {
                fontSize: 6.5,
                bold: true,
                color: '#bd8635',
            },
            textotablaboldlarge: {
                fontSize: 12,
                bold: true,
                color: '#bd8635',
            },
            textotablaboldblack: {
                fontSize: 7,
                bold: true,
                color: '#000000',
            },
            textotablacolor: {
                fontSize: 6.5,
                color: '#ffffff',
                bold: true,
            },
            parrafo: {
                fontSize: 8,
            },
            parrafoBold: {
                fontSize: 8,
                bold: true,
            },
            parrafoItalic: {
                fontSize: 8,
                italics: true,
            },
            footer: {
                fontSize: 6,
            },
            quote: {
                italics: true
            },
            small: {
                fontSize: 8
            },
            minispace: {
                fontSize: 3
            }
        }   
    };
    var nameF = nameFile + ".pdf"
    var pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream(temporalFilesPath + nameF));
    pdfDoc.end();

    try {
        fs.unlinkSync(temporalFilesPath + imageQR)
        //file removed
    } catch(err) {
        console.error(err)
    }
}

//getPDFCasaDiaz()

module.exports = {
    getPDFCasaDiaz : getPDFCasaDiaz
}