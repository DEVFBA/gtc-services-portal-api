var fonts = {
    Roboto: {
      normal: 'C:/GTC/Fonts/Roboto-Regular.ttf',
      bold: 'C:/GTC/Fonts/Roboto-Bold.ttf',
      italics: 'C:/GTC/Fonts/Montserrat-Italic.ttf',
      bolditalics: 'C:/GTC/Fonts/Montserrat-BoldItalic.ttf'
    }
};

/*var fonts = {
    Roboto: {
      normal: '/Users/alexishernandezolvera/Desktop/GTC/PROYECTOS/gtc-services-portal-api/utils/fonts/Roboto-Regular.ttf',
      bold: '/Users/alexishernandezolvera/Desktop/GTC/PROYECTOS/gtc-services-portal-api/utils/fonts/Roboto-Bold.ttf',
      italics: '/Users/alexishernandezolvera/Desktop/GTC/PROYECTOS/gtc-services-portal-api/utils/fonts/Montserrat-Italic.ttf',
      bolditalics: '/Users/alexishernandezolvera/Desktop/GTC/PROYECTOS/gtc-services-portal-api/utils/fonts/Montserrat-BoldItalic.ttf'
    }
};*/

var convert = require('xml-js');
var PdfPrinter = require('pdfmake');
var printer = new PdfPrinter(fonts);
const { AwesomeQR } = require("awesome-qr");
const fs = require("fs");
const xml = require('../../xml.js')
const pdf2base64 = require('pdf-to-base64');

const dbcatcatalogs = require('../../../controllers/cat-catalogs')
const dbcatgeneralparameters = require('../../../controllers/cat-general-parameters');
const e = require('connect-timeout');
const logger = require('../../logger.js');

var xml64 = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPGNmZGk6Q29tcHJvYmFudGUgeG1sbnM6Y2ZkaT0iaHR0cDovL3d3dy5zYXQuZ29iLm14L2NmZC8zIiB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiB4c2k6c2NoZW1hTG9jYXRpb249Imh0dHA6Ly93d3cuc2F0LmdvYi5teC9jZmQvMyBodHRwOi8vd3d3LnNhdC5nb2IubXgvc2l0aW9faW50ZXJuZXQvY2ZkLzMvY2ZkdjMzLnhzZCIgVmVyc2lvbj0iMy4zIiBTZXJpZT0iUkkiIEZvbGlvPSI5MDA3MSIgRmVjaGE9IjIwMjItMDMtMDhUMTc6MDQ6MTgiIFNlbGxvPSIiIEZvcm1hUGFnbz0iOTkiIE5vQ2VydGlmaWNhZG89IiIgQ2VydGlmaWNhZG89IiIgQ29uZGljaW9uZXNEZVBhZ289IjYwIERJQVMgTkVUT1MiIFN1YlRvdGFsPSI1MDU1NCIgTW9uZWRhPSJNWE4iIFRpcG9DYW1iaW89IjEiIFRvdGFsPSI1ODY0Mi42NCIgVGlwb0RlQ29tcHJvYmFudGU9IkkiIE1ldG9kb1BhZ289IlBQRCIgTHVnYXJFeHBlZGljaW9uPSI3NjI0NiI+Cgk8Y2ZkaTpFbWlzb3IgUmZjPSJJUE02MjAzMjI2QjQiIE5vbWJyZT0iSVRXIFBvbHltZXggUyBERSBSTCBERSBDViIgUmVnaW1lbkZpc2NhbD0iNjAxIi8+Cgk8Y2ZkaTpSZWNlcHRvciBSZmM9IkRNQTk4MDcyNTJWQSIgTm9tYnJlPSJESVNUUklCVUlET1JBIE1BUlBWRUwgREUgQVVUT1BBUlRFUyBTQSAgREUgQ1YiIFVzb0NGREk9IkcwMSIvPgoJPGNmZGk6Q29uY2VwdG9zPgoJCTxjZmRpOkNvbmNlcHRvIENsYXZlUHJvZFNlcnY9IjMxMjAxNjMxIiBOb0lkZW50aWZpY2FjaW9uPSIxMDMtQSIgQ2FudGlkYWQ9IjEwIiBDbGF2ZVVuaWRhZD0iWDRHIiBVbmlkYWQ9IkNBIiBEZXNjcmlwY2lvbj0iSU5GTEEtTExBTlRBUyBRVEYgMzQxRyIgVmFsb3JVbml0YXJpbz0iNzgzLjMwMDAiIEltcG9ydGU9Ijc4MzMuMDAiID4KCQkJPGNmZGk6SW1wdWVzdG9zPgoJCQk8Y2ZkaTpUcmFzbGFkb3M+CgkJCQk8Y2ZkaTpUcmFzbGFkbyBCYXNlPSI3ODMzLjAwIiBJbXB1ZXN0bz0iMDAyIiBUaXBvRmFjdG9yPSJUYXNhIiBUYXNhT0N1b3RhPSIwLjE2MDAwMCIgSW1wb3J0ZT0iMTI1My4yOCIgLz4KCQkJPC9jZmRpOlRyYXNsYWRvcz4KCQkJPC9jZmRpOkltcHVlc3Rvcz4KCQk8L2NmZGk6Q29uY2VwdG8+CgkJPGNmZGk6Q29uY2VwdG8gQ2xhdmVQcm9kU2Vydj0iMzEyMDE2MjciIE5vSWRlbnRpZmljYWNpb249IjE0LUEiIENhbnRpZGFkPSIxMCIgQ2xhdmVVbmlkYWQ9Ilg0RyIgVW5pZGFkPSJDQSIgRGVzY3JpcGNpb249IkZJSkFET1IgVEYgMjQ1IEFaVUwgNk1MIiBWYWxvclVuaXRhcmlvPSIxOTAxLjIwMDAiIEltcG9ydGU9IjE5MDEyLjAwIiA+CgkJCTxjZmRpOkltcHVlc3Rvcz4KCQkJPGNmZGk6VHJhc2xhZG9zPgoJCQkJPGNmZGk6VHJhc2xhZG8gQmFzZT0iMTkwMTIuMDAiIEltcHVlc3RvPSIwMDIiIFRpcG9GYWN0b3I9IlRhc2EiIFRhc2FPQ3VvdGE9IjAuMTYwMDAwIiBJbXBvcnRlPSIzMDQxLjkyIiAvPgoJCQk8L2NmZGk6VHJhc2xhZG9zPgoJCQk8L2NmZGk6SW1wdWVzdG9zPgoJCTwvY2ZkaTpDb25jZXB0bz4KCQk8Y2ZkaTpDb25jZXB0byBDbGF2ZVByb2RTZXJ2PSIzMTIwMTYwMCIgTm9JZGVudGlmaWNhY2lvbj0iMjItQyIgQ2FudGlkYWQ9IjEwIiBDbGF2ZVVuaWRhZD0iWDRHIiBVbmlkYWQ9IkNBIiBEZXNjcmlwY2lvbj0iU0VMTEEgRlVHQVMgUkFESUFET1IgMzU1TUwiIFZhbG9yVW5pdGFyaW89IjQwMS44MDAwIiBJbXBvcnRlPSI0MDE4LjAwIiA+CgkJCTxjZmRpOkltcHVlc3Rvcz4KCQkJPGNmZGk6VHJhc2xhZG9zPgoJCQkJPGNmZGk6VHJhc2xhZG8gQmFzZT0iNDAxOC4wMCIgSW1wdWVzdG89IjAwMiIgVGlwb0ZhY3Rvcj0iVGFzYSIgVGFzYU9DdW90YT0iMC4xNjAwMDAiIEltcG9ydGU9IjY0Mi44OCIgLz4KCQkJPC9jZmRpOlRyYXNsYWRvcz4KCQkJPC9jZmRpOkltcHVlc3Rvcz4KCQk8L2NmZGk6Q29uY2VwdG8+CgkJPGNmZGk6Q29uY2VwdG8gQ2xhdmVQcm9kU2Vydj0iNDcxMzE4MjEiIE5vSWRlbnRpZmljYWNpb249IjI1MTA4IiBDYW50aWRhZD0iMTAiIENsYXZlVW5pZGFkPSJYNEciIFVuaWRhZD0iQ0EiIERlc2NyaXBjaW9uPSJGQVNUIE9SQU5HRSBMSU1QSUFET1IgTUFOT1MgNy4iIFZhbG9yVW5pdGFyaW89IjYyNy4yMDAwIiBJbXBvcnRlPSI2MjcyLjAwIiA+CgkJCTxjZmRpOkltcHVlc3Rvcz4KCQkJPGNmZGk6VHJhc2xhZG9zPgoJCQkJPGNmZGk6VHJhc2xhZG8gQmFzZT0iNjI3Mi4wMCIgSW1wdWVzdG89IjAwMiIgVGlwb0ZhY3Rvcj0iVGFzYSIgVGFzYU9DdW90YT0iMC4xNjAwMDAiIEltcG9ydGU9IjEwMDMuNTIiIC8+CgkJCTwvY2ZkaTpUcmFzbGFkb3M+CgkJCTwvY2ZkaTpJbXB1ZXN0b3M+CgkJPC9jZmRpOkNvbmNlcHRvPgoJCTxjZmRpOkNvbmNlcHRvIENsYXZlUHJvZFNlcnY9IjMxMjAxNjAwIiBOb0lkZW50aWZpY2FjaW9uPSI2MS1BIiBDYW50aWRhZD0iMTAiIENsYXZlVW5pZGFkPSJYNEciIFVuaWRhZD0iQ0EiIERlc2NyaXBjaW9uPSJTT0xEQURVUkEgRU4gRlJJTyBUIDcwRyIgVmFsb3JVbml0YXJpbz0iMTM0MS45MDAwIiBJbXBvcnRlPSIxMzQxOS4wMCIgPgoJCQk8Y2ZkaTpJbXB1ZXN0b3M+CgkJCTxjZmRpOlRyYXNsYWRvcz4KCQkJCTxjZmRpOlRyYXNsYWRvIEJhc2U9IjEzNDE5LjAwIiBJbXB1ZXN0bz0iMDAyIiBUaXBvRmFjdG9yPSJUYXNhIiBUYXNhT0N1b3RhPSIwLjE2MDAwMCIgSW1wb3J0ZT0iMjE0Ny4wNCIgLz4KCQkJPC9jZmRpOlRyYXNsYWRvcz4KCQkJPC9jZmRpOkltcHVlc3Rvcz4KCQk8L2NmZGk6Q29uY2VwdG8+Cgk8L2NmZGk6Q29uY2VwdG9zPgoJPGNmZGk6SW1wdWVzdG9zIFRvdGFsSW1wdWVzdG9zVHJhc2xhZGFkb3M9IjgwODguNjQiPgoJCTxjZmRpOlRyYXNsYWRvcz4KCQkJPGNmZGk6VHJhc2xhZG8gSW1wdWVzdG89IjAwMiIgVGlwb0ZhY3Rvcj0iVGFzYSIgVGFzYU9DdW90YT0iMC4xNjAwMDAiIEltcG9ydGU9IjgwODguNjQiIC8+CgkJPC9jZmRpOlRyYXNsYWRvcz4KCTwvY2ZkaTpJbXB1ZXN0b3M+Cgk8Y2ZkaTpDb21wbGVtZW50bz4KCQk8bGV5ZW5kYXNGaXNjOkxleWVuZGFzRmlzY2FsZXMgVmVyc2lvbj0iMS4wIiB4bWxuczp4cz0iaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEiIHhtbG5zOmxleWVuZGFzRmlzYz0iaHR0cDovL3d3dy5zYXQuZ29iLm14L2xleWVuZGFzRmlzY2FsZXMiIHRhcmdldE5hbWVzcGFjZT0iaHR0cDovL3d3dy5zYXQuZ29iLm14L2xleWVuZGFzRmlzY2FsZXMiPgoJCQk8bGV5ZW5kYXNGaXNjOkxleWVuZGEgZGlzcG9zaWNpb25GaXNjYWw9IlJHQ0UiIG5vcm1hPSI1LjIuNi4iIHRleHRvTGV5ZW5kYT0iRGUgY29uZm9ybWlkYWQgYWwgYXJ0w61jdWxvIDI5LCBmcmFjY2nDs24gSSBkZSBsYSBMZXkgZGVsIElWQSB5IGxhIHJlZ2xhIDUuMi41LiwgZnJhY2Npw7NuIElJLCBkZSBsYXMgUmVnbGFzIEdlbmVyYWxlcyBkZSBDb21lcmNpbyBFeHRlcmlvciBwYXJhIDIwMjIgc2UgcmVhbGl6YSBsYSBwcmVzZW50ZSBvcGVyYWNpw7NuIGN1bXBsaWVuZG8gY29uIGxvIGVzdGFibGVjaWRvIGVuIGxhcyByZWdsYXMgNC4zLjIxLiB5IDUuMi42LiBTZSB0cmFuc2ZpZXJlIGxhIG1lcmNhbmPDrWEgYSBERUxNRVggREUgSlVBUkVaIFMgREUgUkwgREUgQ1YgcXVpZW4gY3VlbnRhIGNvbiBuw7ptZXJvIGRlIHJlZ2lzdHJvIElNTUVYIDcwMi0yMDA2LiIvPgoJCTwvbGV5ZW5kYXNGaXNjOkxleWVuZGFzRmlzY2FsZXM+Cgk8L2NmZGk6Q29tcGxlbWVudG8+CjwvY2ZkaTpDb21wcm9iYW50ZT4="
var xml642 = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPGNmZGk6Q29tcHJvYmFudGUgeG1sbnM6Y2ZkaT0iaHR0cDovL3d3dy5zYXQuZ29iLm14L2NmZC8zIgogICAgICAgICAgICAgICAgICB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIgogICAgICAgICAgICAgICAgICB4c2k6c2NoZW1hTG9jYXRpb249Imh0dHA6Ly93d3cuc2F0LmdvYi5teC9jZmQvMyBodHRwOi8vd3d3LnNhdC5nb2IubXgvc2l0aW9faW50ZXJuZXQvY2ZkLzMvY2ZkdjMzLnhzZCAgaHR0cDovL3d3dy5zYXQuZ29iLm14L2xleWVuZGFzRmlzY2FsZXMgaHR0cDovL3d3dy5zYXQuZ29iLm14L3NpdGlvX2ludGVybmV0L2NmZC9sZXllbmRhc0Zpc2NhbGVzL2xleWVuZGFzRmlzYy54c2QiCiAgICAgICAgICAgICAgICAgIHhtbG5zOmxleWVuZGFzRmlzYz0iaHR0cDovL3d3dy5zYXQuZ29iLm14L2xleWVuZGFzRmlzY2FsZXMiCiAgICAgICAgICAgICAgICAgIFZlcnNpb249IjMuMyIKICAgICAgICAgICAgICAgICAgU2VyaWU9IlRFU1QiCiAgICAgICAgICAgICAgICAgIEZvbGlvPSIyMjAzMTcwMSIKICAgICAgICAgICAgICAgICAgRmVjaGE9IjIwMjItMDMtMTdUMDc6MDQ6MTgiCiAgICAgICAgICAgICAgICAgIFNlbGxvPSJoSjFTZzZHNFZyTExYUnhLejV5NitGNXVYYjMxQzNacS84dy96ZlRGd0V3NWFBUXZFazFjZHRDYU9GRGgrVmQyTU5jSnN4Y29tSUlQQXZSUWJhNkVnUkxML1hCWGlyZU9paStVRWg0b3ZEb1lxOVg4T3dTZ3c3S0x2b1J4RDgyaXY1ejU1dWVoY3hPUzRka1dqQWZ3cC9RN3lJekppL28wSjRjTDAzSDVaVGtYY3hRYXE0NHcrS1FUcDlueFpvVzR2WXUxVDRvZ0xsSHBzZTZRblRVRE9Ebk1Ncm5IQVFHSEozWnZSOVd3QzlFcXJvaHlEbG9MTHc4YlNqNGxRREM1eXdYcmE3a0ljcnNnYWZ5c2xnbm9jdkxSQUVOdUJXWnZTN3loeGJqT0NPS0ZWRDQ3OHZOcytMSjMrY0Y4WnFFREdjNVdjNXNyRXhQNXl0TStsRkFoV1E9PSIKICAgICAgICAgICAgICAgICAgRm9ybWFQYWdvPSI5OSIKICAgICAgICAgICAgICAgICAgTm9DZXJ0aWZpY2Fkbz0iMDAwMDEwMDAwMDA1MDY3NDIzMDgiCiAgICAgICAgICAgICAgICAgIENlcnRpZmljYWRvPSJNSUlGL0RDQ0ErU2dBd0lCQWdJVU1EQXdNREV3TURBd01EQTFNRFkzTkRJek1EZ3dEUVlKS29aSWh2Y05BUUVMQlFBd2dnR0VNU0F3SGdZRFZRUUREQmRCVlZSUFVrbEVRVVFnUTBWU1ZFbEdTVU5CUkU5U1FURXVNQ3dHQTFVRUNnd2xVMFZTVmtsRFNVOGdSRVVnUVVSTlNVNUpVMVJTUVVOSlQwNGdWRkpKUWxWVVFWSkpRVEVhTUJnR0ExVUVDd3dSVTBGVUxVbEZVeUJCZFhSb2IzSnBkSGt4S2pBb0Jna3Foa2lHOXcwQkNRRVdHMk52Ym5SaFkzUnZMblJsWTI1cFkyOUFjMkYwTG1kdllpNXRlREVtTUNRR0ExVUVDUXdkUVZZdUlFaEpSRUZNUjA4Z056Y3NJRU5QVEM0Z1IxVkZVbEpGVWs4eERqQU1CZ05WQkJFTUJUQTJNekF3TVFzd0NRWURWUVFHRXdKTldERVpNQmNHQTFVRUNBd1FRMGxWUkVGRUlFUkZJRTFGV0VsRFR6RVRNQkVHQTFVRUJ3d0tRMVZCVlVoVVJVMVBRekVWTUJNR0ExVUVMUk1NVTBGVU9UY3dOekF4VGs0ek1Wd3dXZ1lKS29aSWh2Y05BUWtDRTAxeVpYTndiMjV6WVdKc1pUb2dRVVJOU1U1SlUxUlNRVU5KVDA0Z1EwVk9WRkpCVENCRVJTQlRSVkpXU1VOSlQxTWdWRkpKUWxWVVFWSkpUMU1nUVV3Z1EwOU9WRkpKUWxWWlJVNVVSVEFlRncweU1UQXpNVEl3TURNM05UTmFGdzB5TlRBek1USXdNRE0zTlROYU1JSEtNU013SVFZRFZRUURFeHBKVkZjZ1VFOU1XU0JOUlZnZ1V5QkVSU0JTVENCRVJTQkRWakVqTUNFR0ExVUVLUk1hU1ZSWElGQlBURmtnVFVWWUlGTWdSRVVnVWt3Z1JFVWdRMVl4SXpBaEJnTlZCQW9UR2tsVVZ5QlFUMHhaSUUxRldDQlRJRVJGSUZKTUlFUkZJRU5XTVNVd0l3WURWUVF0RXh4SlVFMDJNakF6TWpJMlFqUWdMeUJNU1ZKQk9ERXdOVEEzVVRJeU1SNHdIQVlEVlFRRkV4VWdMeUJNU1ZKQk9ERXdOVEEzVFZaYVEwMU1NRGd4RWpBUUJnTlZCQXNUQ1ZCU1NVNURTVkJCVERDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBTHEzUzBWTVNuNDFuQ1F0dFhYL3FDSkxOUEtzZjdNRlU4TFFJTDlQbTRheG10UWszTUlXUnM0dnQ1Z2x5ZlFCT1grMVlJTWNES01ITVNXeklySmRycUhMeG9QSVlxR2xRNXU4OFpTS0o2eEh5a0gvQmp4Vzh2dE0yRXJpRnh6NFN3aHkyRENIVmxBTjZ2bnY0MTF1Y20ydjVhS1BjT1JTWGpTenRoVTZ2K0g4aHRTek9ldSs2M0Exc0VuRG9IZUVuV1dSN1IxVWpIWDVHdEpMaXZWYlhjK2hXS3A1VDZOT2xpaTRDLzE3WXE5NW9nV0lpS1BSelVMTWlIV2pqSG5IanQ0RkQxSzBLZDlmMWFmZmI2S2dxNUllUGx5V3FaTU85ZlQ4ZVNZWjlGbXFsU2ppVkxiSEt3ZUtkYWdkTnhPTzhGd1pXeEFXSDRKVlZMdXV2Z01RcVpzQ0F3RUFBYU1kTUJzd0RBWURWUjBUQVFIL0JBSXdBREFMQmdOVkhROEVCQU1DQnNBd0RRWUpLb1pJaHZjTkFRRUxCUUFEZ2dJQkFEN28xaEJXYnNRTkRKbE9XSkZEd2htdGsxeWtJemFWR0llYmx1WDFWSFByTzdTTkowU1J1T1pOQktBWEVMQkYyR1JuZGl5STFhT3VsM2lnRFFXNHNZdkhHOGRMRnF4MlFUV3dldmdsSkpuN3hBeUFHUGdTZ1lwN2tDdDN3ZkZ3NDVWOUxReERVWmtLbExrWEdmTWxSc0dCNXozNVd2eUdMWkFvWWRGMG1FUGFtYk1UVnFCR0ZVQUpSMWNvbkNHYk5RT1BINDNJTnhxRTdMdlVGMnczYnhBL1NtU1NEUUF3OTJxUExOd1hyYWorV1BEY1E3bVlVMUFyQVZHUXM2b041TzlWUitFekQzVjc4cGxWcHhjbHZZcXZPRnRuT2t6dDRURXVTSU5jNXRiZDFXdU5uUlh2VGMydFMwRU9RdklOaVl4cjU0ZnBZdnh2Q1VuNFA0aFJ6YXlUTkRYQjQ5VDZXam5zMDlxRmdGVjlkM2ZOZHFkaFVkNSsxUzMxQnNGK3RXemI4aTBBcy80d0M3U1JIcTgvWlJRSmw4aWlIcGtUOTdDVlFDZHlFdUhzQ1VIdmJpMkQ5MDBrejRjQUF1QkFKb1RRdkNheFU1MlFSZk5nV2ZPRWljY0FUWUpSeUxkeGV3SmdUZUR6OFBGUG9jTHJ2S1BFN2x0TnRONjc3eWNyTXMrK1BoUVdyalUxTHFEQVhJNGNiMW9VYVMzOU1kR2c3K0ZFaVZPQWFFTHpScGQwZXgzbWFTbm1TZ2R6SzRCaFcyWFloSzBJVnBxY2haVnR3YTcrWERSZWJPOVk2RVoxVngxc3B6T2x3SUdmOFpWTWt5WjlOekJtVkFLR0hxQ3MyMDB3eENzNTJmL3ViSUNuQ1dIQnd0aWEyeXpiTWpWdW5XUVRtTWk0ZVpYbCIKICAgICAgICAgICAgICAgICAgQ29uZGljaW9uZXNEZVBhZ289IjYwIERJQVMgTkVUT1MiCiAgICAgICAgICAgICAgICAgIFN1YlRvdGFsPSI1MDU1NCIKICAgICAgICAgICAgICAgICAgTW9uZWRhPSJNWE4iCiAgICAgICAgICAgICAgICAgIFRpcG9DYW1iaW89IjEiCiAgICAgICAgICAgICAgICAgIFRvdGFsPSI1ODY0Mi42NCIKICAgICAgICAgICAgICAgICAgVGlwb0RlQ29tcHJvYmFudGU9IkkiCiAgICAgICAgICAgICAgICAgIE1ldG9kb1BhZ289IlBQRCIKICAgICAgICAgICAgICAgICAgTHVnYXJFeHBlZGljaW9uPSI3NjI0NiI+Cgk8Y2ZkaTpFbWlzb3IgUmZjPSJJUE02MjAzMjI2QjQiCgkgICAgICAgICAgICAgTm9tYnJlPSJJVFcgUG9seW1leCBTIERFIFJMIERFIENWIgoJICAgICAgICAgICAgIFJlZ2ltZW5GaXNjYWw9IjYwMSIvPgoJPGNmZGk6UmVjZXB0b3IgUmZjPSJETUE5ODA3MjUyVkEiCgkgICAgICAgICAgICAgICBOb21icmU9IkRJU1RSSUJVSURPUkEgTUFSUFZFTCBERSBBVVRPUEFSVEVTIFNBICBERSBDViIKCSAgICAgICAgICAgICAgIFVzb0NGREk9IkcwMSIvPgoJPGNmZGk6Q29uY2VwdG9zPgoJCTxjZmRpOkNvbmNlcHRvIENsYXZlUHJvZFNlcnY9IjMxMjAxNjMxIgoJCSAgICAgICAgICAgICAgIE5vSWRlbnRpZmljYWNpb249IjEwMy1BIgoJCSAgICAgICAgICAgICAgIENhbnRpZGFkPSIxMCIKCQkgICAgICAgICAgICAgICBDbGF2ZVVuaWRhZD0iWDRHIgoJCSAgICAgICAgICAgICAgIFVuaWRhZD0iQ0EiCgkJICAgICAgICAgICAgICAgRGVzY3JpcGNpb249IklORkxBLUxMQU5UQVMgUVRGIDM0MUciCgkJICAgICAgICAgICAgICAgVmFsb3JVbml0YXJpbz0iNzgzLjMwMDAiCgkJICAgICAgICAgICAgICAgSW1wb3J0ZT0iNzgzMy4wMCI+CgkJCTxjZmRpOkltcHVlc3Rvcz4KCQkJCTxjZmRpOlRyYXNsYWRvcz4KCQkJCQk8Y2ZkaTpUcmFzbGFkbyBCYXNlPSI3ODMzLjAwIgoJCQkJCSAgICAgICAgICAgICAgIEltcHVlc3RvPSIwMDIiCgkJCQkJICAgICAgICAgICAgICAgVGlwb0ZhY3Rvcj0iVGFzYSIKCQkJCQkgICAgICAgICAgICAgICBUYXNhT0N1b3RhPSIwLjE2MDAwMCIKCQkJCQkgICAgICAgICAgICAgICBJbXBvcnRlPSIxMjUzLjI4Ii8+CgkJCQk8L2NmZGk6VHJhc2xhZG9zPgoJCQk8L2NmZGk6SW1wdWVzdG9zPgoJCTwvY2ZkaTpDb25jZXB0bz4KCQk8Y2ZkaTpDb25jZXB0byBDbGF2ZVByb2RTZXJ2PSIzMTIwMTYyNyIKCQkgICAgICAgICAgICAgICBOb0lkZW50aWZpY2FjaW9uPSIxNC1BIgoJCSAgICAgICAgICAgICAgIENhbnRpZGFkPSIxMCIKCQkgICAgICAgICAgICAgICBDbGF2ZVVuaWRhZD0iWDRHIgoJCSAgICAgICAgICAgICAgIFVuaWRhZD0iQ0EiCgkJICAgICAgICAgICAgICAgRGVzY3JpcGNpb249IkZJSkFET1IgVEYgMjQ1IEFaVUwgNk1MIgoJCSAgICAgICAgICAgICAgIFZhbG9yVW5pdGFyaW89IjE5MDEuMjAwMCIKCQkgICAgICAgICAgICAgICBJbXBvcnRlPSIxOTAxMi4wMCI+CgkJCTxjZmRpOkltcHVlc3Rvcz4KCQkJCTxjZmRpOlRyYXNsYWRvcz4KCQkJCQk8Y2ZkaTpUcmFzbGFkbyBCYXNlPSIxOTAxMi4wMCIKCQkJCQkgICAgICAgICAgICAgICBJbXB1ZXN0bz0iMDAyIgoJCQkJCSAgICAgICAgICAgICAgIFRpcG9GYWN0b3I9IlRhc2EiCgkJCQkJICAgICAgICAgICAgICAgVGFzYU9DdW90YT0iMC4xNjAwMDAiCgkJCQkJICAgICAgICAgICAgICAgSW1wb3J0ZT0iMzA0MS45MiIvPgoJCQkJPC9jZmRpOlRyYXNsYWRvcz4KCQkJPC9jZmRpOkltcHVlc3Rvcz4KCQk8L2NmZGk6Q29uY2VwdG8+CgkJPGNmZGk6Q29uY2VwdG8gQ2xhdmVQcm9kU2Vydj0iMzEyMDE2MDAiCgkJICAgICAgICAgICAgICAgTm9JZGVudGlmaWNhY2lvbj0iMjItQyIKCQkgICAgICAgICAgICAgICBDYW50aWRhZD0iMTAiCgkJICAgICAgICAgICAgICAgQ2xhdmVVbmlkYWQ9Ilg0RyIKCQkgICAgICAgICAgICAgICBVbmlkYWQ9IkNBIgoJCSAgICAgICAgICAgICAgIERlc2NyaXBjaW9uPSJTRUxMQSBGVUdBUyBSQURJQURPUiAzNTVNTCIKCQkgICAgICAgICAgICAgICBWYWxvclVuaXRhcmlvPSI0MDEuODAwMCIKCQkgICAgICAgICAgICAgICBJbXBvcnRlPSI0MDE4LjAwIj4KCQkJPGNmZGk6SW1wdWVzdG9zPgoJCQkJPGNmZGk6VHJhc2xhZG9zPgoJCQkJCTxjZmRpOlRyYXNsYWRvIEJhc2U9IjQwMTguMDAiCgkJCQkJICAgICAgICAgICAgICAgSW1wdWVzdG89IjAwMiIKCQkJCQkgICAgICAgICAgICAgICBUaXBvRmFjdG9yPSJUYXNhIgoJCQkJCSAgICAgICAgICAgICAgIFRhc2FPQ3VvdGE9IjAuMTYwMDAwIgoJCQkJCSAgICAgICAgICAgICAgIEltcG9ydGU9IjY0Mi44OCIvPgoJCQkJPC9jZmRpOlRyYXNsYWRvcz4KCQkJPC9jZmRpOkltcHVlc3Rvcz4KCQk8L2NmZGk6Q29uY2VwdG8+CgkJPGNmZGk6Q29uY2VwdG8gQ2xhdmVQcm9kU2Vydj0iNDcxMzE4MjEiCgkJICAgICAgICAgICAgICAgTm9JZGVudGlmaWNhY2lvbj0iMjUxMDgiCgkJICAgICAgICAgICAgICAgQ2FudGlkYWQ9IjEwIgoJCSAgICAgICAgICAgICAgIENsYXZlVW5pZGFkPSJYNEciCgkJICAgICAgICAgICAgICAgVW5pZGFkPSJDQSIKCQkgICAgICAgICAgICAgICBEZXNjcmlwY2lvbj0iRkFTVCBPUkFOR0UgTElNUElBRE9SIE1BTk9TIDcuIgoJCSAgICAgICAgICAgICAgIFZhbG9yVW5pdGFyaW89IjYyNy4yMDAwIgoJCSAgICAgICAgICAgICAgIEltcG9ydGU9IjYyNzIuMDAiPgoJCQk8Y2ZkaTpJbXB1ZXN0b3M+CgkJCQk8Y2ZkaTpUcmFzbGFkb3M+CgkJCQkJPGNmZGk6VHJhc2xhZG8gQmFzZT0iNjI3Mi4wMCIKCQkJCQkgICAgICAgICAgICAgICBJbXB1ZXN0bz0iMDAyIgoJCQkJCSAgICAgICAgICAgICAgIFRpcG9GYWN0b3I9IlRhc2EiCgkJCQkJICAgICAgICAgICAgICAgVGFzYU9DdW90YT0iMC4xNjAwMDAiCgkJCQkJICAgICAgICAgICAgICAgSW1wb3J0ZT0iMTAwMy41MiIvPgoJCQkJPC9jZmRpOlRyYXNsYWRvcz4KCQkJPC9jZmRpOkltcHVlc3Rvcz4KCQk8L2NmZGk6Q29uY2VwdG8+CgkJPGNmZGk6Q29uY2VwdG8gQ2xhdmVQcm9kU2Vydj0iMzEyMDE2MDAiCgkJICAgICAgICAgICAgICAgTm9JZGVudGlmaWNhY2lvbj0iNjEtQSIKCQkgICAgICAgICAgICAgICBDYW50aWRhZD0iMTAiCgkJICAgICAgICAgICAgICAgQ2xhdmVVbmlkYWQ9Ilg0RyIKCQkgICAgICAgICAgICAgICBVbmlkYWQ9IkNBIgoJCSAgICAgICAgICAgICAgIERlc2NyaXBjaW9uPSJTT0xEQURVUkEgRU4gRlJJTyBUIDcwRyIKCQkgICAgICAgICAgICAgICBWYWxvclVuaXRhcmlvPSIxMzQxLjkwMDAiCgkJICAgICAgICAgICAgICAgSW1wb3J0ZT0iMTM0MTkuMDAiPgoJCQk8Y2ZkaTpJbXB1ZXN0b3M+CgkJCQk8Y2ZkaTpUcmFzbGFkb3M+CgkJCQkJPGNmZGk6VHJhc2xhZG8gQmFzZT0iMTM0MTkuMDAiCgkJCQkJICAgICAgICAgICAgICAgSW1wdWVzdG89IjAwMiIKCQkJCQkgICAgICAgICAgICAgICBUaXBvRmFjdG9yPSJUYXNhIgoJCQkJCSAgICAgICAgICAgICAgIFRhc2FPQ3VvdGE9IjAuMTYwMDAwIgoJCQkJCSAgICAgICAgICAgICAgIEltcG9ydGU9IjIxNDcuMDQiLz4KCQkJCTwvY2ZkaTpUcmFzbGFkb3M+CgkJCTwvY2ZkaTpJbXB1ZXN0b3M+CgkJPC9jZmRpOkNvbmNlcHRvPgoJPC9jZmRpOkNvbmNlcHRvcz4KCTxjZmRpOkltcHVlc3RvcyBUb3RhbEltcHVlc3Rvc1RyYXNsYWRhZG9zPSI4MDg4LjY0Ij4KCQk8Y2ZkaTpUcmFzbGFkb3M+CgkJCTxjZmRpOlRyYXNsYWRvIEltcHVlc3RvPSIwMDIiCgkJCSAgICAgICAgICAgICAgIFRpcG9GYWN0b3I9IlRhc2EiCgkJCSAgICAgICAgICAgICAgIFRhc2FPQ3VvdGE9IjAuMTYwMDAwIgoJCQkgICAgICAgICAgICAgICBJbXBvcnRlPSI4MDg4LjY0Ii8+CgkJPC9jZmRpOlRyYXNsYWRvcz4KCTwvY2ZkaTpJbXB1ZXN0b3M+Cgk8Y2ZkaTpDb21wbGVtZW50bz4KCQk8dGZkOlRpbWJyZUZpc2NhbERpZ2l0YWwgeG1sbnM6dGZkPSJodHRwOi8vd3d3LnNhdC5nb2IubXgvVGltYnJlRmlzY2FsRGlnaXRhbCIKCQkgICAgICAgICAgICAgICAgICAgICAgICAgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIKCQkgICAgICAgICAgICAgICAgICAgICAgICAgeHNpOnNjaGVtYUxvY2F0aW9uPSJodHRwOi8vd3d3LnNhdC5nb2IubXgvVGltYnJlRmlzY2FsRGlnaXRhbCBodHRwOi8vd3d3LnNhdC5nb2IubXgvc2l0aW9faW50ZXJuZXQvY2ZkL1RpbWJyZUZpc2NhbERpZ2l0YWwvVGltYnJlRmlzY2FsRGlnaXRhbHYxMS54c2QiCgkJICAgICAgICAgICAgICAgICAgICAgICAgIFZlcnNpb249IjEuMSIKCQkgICAgICAgICAgICAgICAgICAgICAgICAgVVVJRD0iNDE3QzI4MUItQkNDRS00QTdFLUEyMTgtRTBERTk4OUM4MEQyIgoJCSAgICAgICAgICAgICAgICAgICAgICAgICBGZWNoYVRpbWJyYWRvPSIyMDIyLTAzLTE3VDEwOjI4OjA0IgoJCSAgICAgICAgICAgICAgICAgICAgICAgICBSZmNQcm92Q2VydGlmPSJBQUEwMTAxMDFBQUEiCgkJICAgICAgICAgICAgICAgICAgICAgICAgIFNlbGxvQ0ZEPSJoSjFTZzZHNFZyTExYUnhLejV5NitGNXVYYjMxQzNacS84dy96ZlRGd0V3NWFBUXZFazFjZHRDYU9GRGgrVmQyTU5jSnN4Y29tSUlQQXZSUWJhNkVnUkxML1hCWGlyZU9paStVRWg0b3ZEb1lxOVg4T3dTZ3c3S0x2b1J4RDgyaXY1ejU1dWVoY3hPUzRka1dqQWZ3cC9RN3lJekppL28wSjRjTDAzSDVaVGtYY3hRYXE0NHcrS1FUcDlueFpvVzR2WXUxVDRvZ0xsSHBzZTZRblRVRE9Ebk1Ncm5IQVFHSEozWnZSOVd3QzlFcXJvaHlEbG9MTHc4YlNqNGxRREM1eXdYcmE3a0ljcnNnYWZ5c2xnbm9jdkxSQUVOdUJXWnZTN3loeGJqT0NPS0ZWRDQ3OHZOcytMSjMrY0Y4WnFFREdjNVdjNXNyRXhQNXl0TStsRkFoV1E9PSIKCQkgICAgICAgICAgICAgICAgICAgICAgICAgTm9DZXJ0aWZpY2Fkb1NBVD0iMjAwMDEwMDAwMDAxMDAwMDU3NjEiCgkJICAgICAgICAgICAgICAgICAgICAgICAgIFNlbGxvU0FUPSJNMWlPZUlIQktWZS9sVytUc2w5RXFsOEN3cVcxdEtnZDNMcGhFY3psbFk3Z2FKVzlDam9hdnUyNHZDMWgyeE9CYm1DQWE2NUJsckdOMUFYYWlMYzhMWG9NKzZweVVGY05Uam9HM1RtdHhDZmkrUjBJZDNoZ01sR2pRZ0Y3WklFYkkrUnBSMG5UZ3gzTDUzekhjTkRzRlFvV1RPZnVXV3hkeEFteU5CZTNaUnc9Ii8+CgkJPGxleWVuZGFzRmlzYzpMZXllbmRhc0Zpc2NhbGVzIHZlcnNpb249IjEuMCI+CgkJCTxsZXllbmRhc0Zpc2M6TGV5ZW5kYSBkaXNwb3NpY2lvbkZpc2NhbD0iUkdDRSIKCQkJICAgICAgICAgICAgICAgICAgICAgIG5vcm1hPSI1LjIuNi4iCgkJCSAgICAgICAgICAgICAgICAgICAgICB0ZXh0b0xleWVuZGE9IkRlIGNvbmZvcm1pZGFkIGFsIGFydMOtY3VsbyAyOSwgZnJhY2Npw7NuIEkgZGUgbGEgTGV5IGRlbCBJVkEgeSBsYSByZWdsYSA1LjIuNS4sIGZyYWNjacOzbiBJSSwgZGUgbGFzIFJlZ2xhcyBHZW5lcmFsZXMgZGUgQ29tZXJjaW8gRXh0ZXJpb3IgcGFyYSAyMDIyIHNlIHJlYWxpemEgbGEgcHJlc2VudGUgb3BlcmFjacOzbiBjdW1wbGllbmRvIGNvbiBsbyBlc3RhYmxlY2lkbyBlbiBsYXMgcmVnbGFzIDQuMy4yMS4geSA1LjIuNi4gU2UgdHJhbnNmaWVyZSBsYSBtZXJjYW5jw61hIGEgREVMTUVYIERFIEpVQVJFWiBTIERFIFJMIERFIENWIHF1aWVuIGN1ZW50YSBjb24gbsO6bWVybyBkZSByZWdpc3RybyBJTU1FWCA3MDItMjAwNi4iLz4KCQk8L2xleWVuZGFzRmlzYzpMZXllbmRhc0Zpc2NhbGVzPgoJPC9jZmRpOkNvbXBsZW1lbnRvPgo8L2NmZGk6Q29tcHJvYmFudGU+"

async function getPDFPolymex(docBase64, txtDocument, pathLogo)
{

    try {

        logger.info('Procesando PDF de Factura de Polymex.');

        //Leo el archivo guardado anteriormente
        const txtString  = fs.readFileSync(txtDocument, 'utf-8');

        //Separamos el archivo por \r para obtener cada uno de los elementos.
        var arrayLineas = txtString.split("\n")
        
        //Obtenemos el array de correos para emailTo
        var arrayEmailTo = arrayLineas[0].split(",")

        //Obtenemos el array de correos para emailCC
        var arrayEmailCC = arrayLineas[1].split(",")

        //Quitamos primer y último elemento de la cadena de parámetros encabezado.
        var params = arrayLineas[2].slice(1,-1)

        //Separamos los parámetros de encabezado por el caracter ^
        var paramsEncabezado = params.split("^")

        //Para obtener los lotes y piezas
        var lotesPiezas = arrayLineas[3].split("|")

        //Para obtener los lotes
        var arrayLotes = lotesPiezas[1].split("^")

        //Para obtener las piezas
        var arrayPiezas = lotesPiezas[2].split("^")

        var xmlString = await xml.serializeXML(docBase64)

        var options = {compact: false, ignoreComment: true, spaces: 4};
        const jsonString = convert.xml2json(xmlString, options);
        const jsonData = JSON.parse(jsonString)
        var conceptos = jsonData.elements[0].elements.find( o => o.name === "cfdi:Conceptos")
        var attributes = jsonData.elements[0].attributes
        var emisor = jsonData.elements[0].elements.find( o => o.name === "cfdi:Emisor")
        var receptor = jsonData.elements[0].elements.find( o => o.name === "cfdi:Receptor")
        var impuestos = jsonData.elements[0].elements.find( o => o.name === "cfdi:Impuestos")
        var trasladosN = impuestos.elements.find( o => o.name === "cfdi:Traslados")
        var complemento = jsonData.elements[0].elements.find( o => o.name === "cfdi:Complemento")
        var timbreFiscal = complemento.elements.find( o => o.name === "tfd:TimbreFiscalDigital")
        var leyendaFiscal = complemento.elements.find( o => o.name === "leyendasFisc:LeyendasFiscales")

        var datosEmisor = {
            text: [
                "\n",
                "\n",
                {text: emisor.attributes.Nombre + `\n`, style: 'textotablaboldlarge'},
                {text: "DOMICILIO FISCAL \n", style: 'encabezadoDomicilio'},
                {text: paramsEncabezado[0] + " No. " + paramsEncabezado[1] + "\n", style: 'encabezadoTexto'},
                {text: paramsEncabezado[2] + "\n", style: 'encabezadoTexto'},
                {text: paramsEncabezado[3] + ", " + paramsEncabezado[4] +  " CP: " + paramsEncabezado[5] +  " " + paramsEncabezado[8] + "\n", style: 'encabezadoTexto'},
                {text: "Tel: " + paramsEncabezado[9] + "\n", style: 'encabezadoTexto'},
                {text: emisor.attributes.Rfc + `\n`, style: 'encabezadoTexto'},
                {text: "Lugar de expedición: " + attributes.LugarExpedicion + "\n", style: 'encabezadoTexto'},
            ]
        }

        var encabezado =
        {
            columns: [
                [
                    {text: datosEmisor}
                ],
                [
                    {
                        table: {
                            body: [
                                [
                                    {border: [false, false, false, false], text: '------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------', alignment: 'center', style: 'textoinvisible'},
                                ],
                                [
                                    {fillColor: "#050583", text:"CFDI versión " + attributes.Version , alignment: 'center', style: 'textotablawhite'},
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
                                return 'black';
                            },
                            vLineColor: function () {
                                return 'black';
                            },
                        }	
                    },
                    { image: pathLogo, width: 180, height: 80, alignment: 'left'},
                    {
                        table: {
                            widths: ["*", 80],
                            body: [
                                [
                                    {fillColor: "#050583", text:"Fecha", alignment: 'center', style: 'textotablawhite'},
                                    {fillColor: "#050583", text:"Factura No.", alignment: 'center', style: 'textotablawhite'},
                                ],
                                [
                                    {text: attributes.Fecha, alignment: 'center', style: 'textotablablack'},
                                    {text: attributes.Serie + attributes.Folio, alignment: 'center', style: 'textotablablack'},
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
                                return 'black';
                            },
                            vLineColor: function () {
                                return 'black';
                            },
                        }	
                    },
                ]
            ]
        }

        var emisorReceptor = 
        {
            table: {
                widths: ["*", 262],
                body: [
                    [
                        {text: 
                            [
                                {text: `Nombre o Razón Social:\n`, style: 'textotablaEmisorReceptor'},
                                {text: receptor.attributes.Nombre + `\n`, style: 'textotablaEmisorReceptor'},
                                {text: paramsEncabezado[10] + " " + paramsEncabezado[11] + `\n`, style: 'textotablaEmisorReceptor'},
                                {text: paramsEncabezado[12] + `\n`, style: 'textotablaEmisorReceptor'},
                                {text: paramsEncabezado[13] + ", " + paramsEncabezado[14] + " CP: " + paramsEncabezado[15] + "\n", style: 'textotablaEmisorReceptor'},
                                {text: "RFC: " + receptor.attributes.Rfc + "\t\t\t\t\t\t\t\t\t\t" + paramsEncabezado[17] + "\n", style: 'textotablaEmisorReceptor'},
                                {text: "Tel: " + paramsEncabezado[16] + "\n", style: 'textotablaEmisorReceptor'},
                            ]
                        },
                        {text: 
                            [
                                {text: `Consignatario\n`, style: 'textotablaEmisorReceptor'},
                                {text: paramsEncabezado[18] + `\n`, style: 'textotablaEmisorReceptor'},
                                {text: paramsEncabezado[19] + " " + paramsEncabezado[20] + `\n`, style: 'textotablaEmisorReceptor'},
                                {text: paramsEncabezado[22] + `\n`, style: 'textotablaEmisorReceptor'},
                                {text: paramsEncabezado[23] + ", " + paramsEncabezado[24] + " " +paramsEncabezado[25] + " CP.\n", style: 'textotablaEmisorReceptor'},
                                {text: paramsEncabezado[26] + `\n`, style: 'textotablaEmisorReceptor'},
                            ]
                        },
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
                    return 'black';
                },
                vLineColor: function () {
                    return 'black';
                },
            }	
        }

        var paramsUsoCFDI = {
            pvOptionCRUD: "R",
            pvIdCatalog: receptor.attributes.UsoCFDI,
            table: "SAT_Cat_CFDI_Uses"
        }

        var resUsoCFDI = await dbcatcatalogs.getCatalogIdDescription(paramsUsoCFDI)

        var paramsTipoComprobante = {
            pvOptionCRUD: "R",
            pvIdCatalog: attributes.TipoDeComprobante,
            table: "SAT_Cat_Receipt_Types"
        }

        var resTipoComprobante = await dbcatcatalogs.getCatalogIdDescription(paramsTipoComprobante);

        var paramsMetodoPago = {
            pvOptionCRUD: "R",
            pvIdCatalog: attributes.MetodoPago,
            table: "SAT_Cat_Payment_Methods"
        }

        var resMetodoPago = await dbcatcatalogs.getCatalogIdDescription(paramsMetodoPago);

        var paramsFormaPago = {
            pvOptionCRUD: "R",
            pvIdCatalog: attributes.FormaPago,
            table: "SAT_Cat_Payment_Instruments"
        }

        var resFormaPago = await dbcatcatalogs.getCatalogIdDescription(paramsFormaPago);

        var tipoComprobante = 
        {
            table: {
                widths: [100,120,90,90,"*"],
                body: [
                    [
                        {border: [true, false, true, false], text: `Tipo de comprobante`, style: 'textotablaEmisorReceptor', alignment: "center"},
                        {border: [true, false, true, false], text: `Tipo de Relación entre CFDI`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, false], text: `Clave de Uso de CFDI`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, false], text: `Método de Pago`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, false], text: `Forma de Pago`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                    ],
                    [
                        {border: [true, false, true, true], text: attributes.TipoDeComprobante + " - " +  resTipoComprobante, style: 'textotablaEmisorReceptor', alignment: "center"},
                        {border: [true, false, true, true], text: ``, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, true], text: receptor.attributes.UsoCFDI + " - " + resUsoCFDI, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, true], text: attributes.MetodoPago + " - " + resMetodoPago, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, true], text: attributes.FormaPago + " - " + resFormaPago, style: 'textotablaEmisorReceptor', alignment: "center"}, 
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
                    return 'black';
                },
                vLineColor: function () {
                    return 'black';
                },
            }	
        }

        var condiciones = 
        {
            table: {
                widths: ["*",90,90,101],
                body: [
                    [
                        {border: [true, false, true, false], text: `Condiciones`, style: 'textotablaEmisorReceptor', alignment: "center"},
                        {border: [true, false, true, false], text: `Orden de Venta`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, false], text: `Fecha Vencimiento`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, false], text: `Orden de Compra`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                    ],
                    [
                        {border: [true, false, true, true], text: attributes.CondicionesDePago, style: 'textotablaEmisorReceptor', alignment: "center"},
                        {border: [true, false, true, true], text: paramsEncabezado[28], style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, true], text: paramsEncabezado[29], style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, true], text: paramsEncabezado[30], style: 'textotablaEmisorReceptor', alignment: "center"}, 
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
                    return 'black';
                },
                vLineColor: function () {
                    return 'black';
                },
            }
        }

        var vendedor = 
        {
            table: {
                widths: [80,200,90,"*"],
                body: [
                    [
                        {border: [true, false, true, false], text: `Vendedor`, style: 'textotablaEmisorReceptor', alignment: "center"},
                        {border: [true, false, true, false], text: `Abono Bancario / Transferencia Electrónica`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, false], text: `Referencia Pago`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, false], text: `Referencia Pago Interbarcario`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                    ],
                    [
                        {border: [true, false, true, true], text: paramsEncabezado[31], style: 'textotablaEmisorReceptor', alignment: "center"},
                        {border: [true, false, true, true], text: paramsEncabezado[32], style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, true], text: paramsEncabezado[33], style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        {border: [true, false, true, true], text: paramsEncabezado[34], style: 'textotablaEmisorReceptor', alignment: "center"}, 
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
                    return 'black';
                },
                vLineColor: function () {
                    return 'black';
                },
            }
        }
        
        var concepts = []
        var psItems = 0;

        concepts[psItems] = [
            {border: [true, true, false, true], text: `Clave Producto`, style: 'textotabla', alignment: "center"},
            {border: [false, true, false, true], text: `Clave SAT`, style: 'textotabla', alignment: "center"}, 
            {border: [false, true, false, true], text: `Descripción`, style: 'textotabla', alignment: "center"}, 
            {border: [false, true, false, true], text: `Unidad`, style: 'textotabla', alignment: "center"}, 
            {border: [false, true, false, true], text: `Clave Unidad`, style: 'textotabla', alignment: "center"}, 
            {border: [false, true, false, true], text: `Cant.`, style: 'textotabla', alignment: "center"},
            {border: [false, true, false, true], text: `Lote`, style: 'textotabla', alignment: "center"}, 
            {border: [false, true, false, true], text: `Piezas`, style: 'textotabla', alignment: "center"}, 
            {border: [false, true, false, true], text: `Precio Unitario`, style: 'textotabla', alignment: "center"}, 
            {border: [false, true, false, true], text: `Base`, style: 'textotabla', alignment: "center"}, 
            {border: [false, true, false, true], text: `Impuesto`, style: 'textotabla', alignment: "center"},
            {border: [false, true, false, true], text: `Factor`, style: 'textotabla', alignment: "center"}, 
            {border: [false, true, false, true], text: `Tasa`, style: 'textotabla', alignment: "center"}, 
            {border: [false, true, true, true], text: `Importe`, style: 'textotabla', alignment: "center"}, 
        ]

        psItems++

        //Iteramos cada uno de los conceptos
        for(var i=0; i<conceptos.elements.length; i++)
        {
            var impuestos = conceptos.elements[i].elements.find( o => o.name === "cfdi:Impuestos")
            var traslados = impuestos.elements.find( o => o.name === "cfdi:Traslados")
            
            if(i !== conceptos.elements.length-1)
            {
                concepts[psItems] = [
                    {border: [true, false, false, false], text: conceptos.elements[i].attributes.NoIdentificacion, style: 'textotabla', alignment: "center"},
                    {border: [false, false, false, false], text: conceptos.elements[i].attributes.ClaveProdServ, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false], text: conceptos.elements[i].attributes.Descripcion, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false], text: conceptos.elements[i].attributes.Unidad, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false], text: conceptos.elements[i].attributes.ClaveUnidad, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false], text: conceptos.elements[i].attributes.Cantidad, style: 'textotabla', alignment: "center"},
                    {border: [false, false, false, false], text: arrayLotes[i], style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false], text: arrayPiezas[i], style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false], text: conceptos.elements[i].attributes.ValorUnitario, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false], text: traslados.elements[0].attributes.Base, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false], text: traslados.elements[0].attributes.Impuesto, style: 'textotabla', alignment: "center"},
                    {border: [false, false, false, false], text: traslados.elements[0].attributes.TipoFactor, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false], text: traslados.elements[0].attributes.TasaOCuota, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, true, false], text: conceptos.elements[i].attributes.Importe, style: 'textotabla', alignment: "center"}, 
                ]
        
                psItems++
            }
            else {
                concepts[psItems] = [
                    {border: [true, false, false, true], text: conceptos.elements[i].attributes.NoIdentificacion, style: 'textotabla', alignment: "center"},
                    {border: [false, false, false, true], text: conceptos.elements[i].attributes.ClaveProdServ, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, true], text: conceptos.elements[i].attributes.Descripcion, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, true], text: conceptos.elements[i].attributes.Unidad, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, true], text: conceptos.elements[i].attributes.ClaveUnidad, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, true], text: conceptos.elements[i].attributes.Cantidad, style: 'textotabla', alignment: "center"},
                    {border: [false, false, false, true], text: arrayLotes[i], style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, true], text: arrayPiezas[i], style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, true], text: conceptos.elements[i].attributes.ValorUnitario, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, true], text: traslados.elements[0].attributes.Base, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, true], text: traslados.elements[0].attributes.Impuesto, style: 'textotabla', alignment: "center"},
                    {border: [false, false, false, true], text: traslados.elements[0].attributes.TipoFactor, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, true], text: traslados.elements[0].attributes.TasaOCuota, style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, true, true], text: conceptos.elements[i].attributes.Importe, style: 'textotabla', alignment: "center"}, 
                ]
        
                psItems++
            }
        }

        var conceptosTable = 
        {
            table: {
                dontBreakRows: true, 
                headerRows: 1,
                widths: [27,35,"*",27,27,27,27,27,27,27,28,27,27,27],
                body: concepts
            },
            layout: {
                hLineWidth: function () {
                    return  0.7;
                },
                vLineWidth: function () {
                    return 0.7;
                },
                hLineColor: function () {
                    return 'black';
                },
                vLineColor: function () {
                    return 'black';
                },
            }
        }

        var leyendasF = {}
        var norma = {}

        if(leyendaFiscal !== undefined)
        {

            leyendasF = {
                table: {
                    widths: [250,"*"],
                    body: [
                        [
                            {text: `Complemento Leyendas Fiscales Versión`, style: 'textotablaEmisorReceptor', alignment: "center"},
                            {text: `Disposición Fiscal`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        ],
                        [
                            {text: leyendaFiscal.attributes.version, style: 'textotablaEmisorReceptor', alignment: "center"},
                            {text: leyendaFiscal.elements[0].attributes.disposicionFiscal, style: 'textotablaEmisorReceptor', alignment: "center"}, 
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
                        return 'black';
                    },
                    vLineColor: function () {
                        return 'black';
                    },
                },
            }

            norma = {
                table: {
                    widths: [250,"*"],
                    body: [
                        [
                            {text: `Norma`, style: 'textotablaEmisorReceptor', alignment: "center"},
                            {text: `Leyenda Fiscal`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        ],
                        [
                            {text: leyendaFiscal.elements[0].attributes.norma, style: 'textotablaEmisorReceptor', alignment: "center"},
                            {text: leyendaFiscal.elements[0].attributes.textoLeyenda, style: 'textotablaEmisorReceptor', alignment: "center"}, 
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
                        return 'black';
                    },
                    vLineColor: function () {
                        return 'black';
                    },
                },
            }
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
                {text: "Cadena original del complemento de certificación digital del SAT:\n", style: 'textotablaEmisorReceptor'},
                {text: `${complementoCertificacionSAT}\n`, style: 'textotablacodigo'},
                {text: "\n", style: 'espacios'},
                {text: "Sello digital del CFDI:\n", style: 'textotablaEmisorReceptor'},
                {text: `${timbreFiscal.attributes.SelloCFD}\n`, style: 'textotablacodigo'},
                {text: "\n", style: 'espacios'},
                {text: "Sello digital del SAT:\n", style: 'textotablaEmisorReceptor'},
                {text: `${timbreFiscal.attributes.SelloSAT}\n`, style: 'textotablacodigo'},
            ]
        }

        var cadenasTable = 
        {
            table: {
                widths: [536],
                body: [
                    [
                        cadenaCodigo
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
                    return 'black';
                },
                vLineColor: function () {
                    return 'black';
                },
            }
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
        //console.log((resTemporalFiles[0])[0].Value)

        var imageQR = timbreFiscal.attributes.UUID + ".png"
        //console.log(imageQR)

        const buffer = await new AwesomeQR({
            text: url,
            size: 500,
        }).draw();

        var temporalFilesPath = (resTemporalFiles[0])[0].Value
        //console.log(temporalFilesPath)
        
        fs.writeFileSync(temporalFilesPath + imageQR, buffer);

        var paramsMoneda = {
            pvOptionCRUD: "R",
            pvIdCatalog: attributes.Moneda,
            table: "SAT_Cat_Currencies"
        }

        var resMoneda = await dbcatcatalogs.getCatalogIdShortDescription(paramsMoneda);

        var totalLetra = numeroALetras(attributes.Total, {
            plural: resMoneda.toUpperCase(),
            singular: resMoneda.toUpperCase(),
        });
        
        var codigos = {
            table: {
                widths: [110, "*", 40,80],
                body: [
                    [
                        {image: temporalFilesPath + imageQR, width: 100, height: 100, alignment: 'center', verticalAlign: 'middle', rowSpan: 3},
                        {border: [false, true, true, true], text:  `DEBO(EMOS) Y PAGARE(MOS) A LA ORDEN DE ITW POLYMEX S DE RL DE CV A LA VISTA LA CANTIDAD INDICADA, PAGOS EFECTUADOS DESPUES DEL VENCIMIENTO CAUSARÁN INTERESES MORATORIOS A RAZÓN DEL % MENSUAL. \n\n ${totalLetra} ${attributes.Moneda}`, alignment: 'left', style: "textotablaEmisorReceptor", rowSpan: 3},
                        {border: [false, true, true, false], text:  "Subtotal", alignment: 'left', style: "textotablatotales"},
                        {border: [false, true, true, false], text:  "$" + Intl.NumberFormat("en-IN").format(attributes.SubTotal), alignment: 'left', style: "textotablatotales"},
                    ],
                    [
                        {},
                        {},
                        {border: [false, false, true, false], text:  "I.V.A. 16%", alignment: 'left', style: "textotablatotales"},
                        {border: [false, false, true, false], text:  "$" + Intl.NumberFormat("en-IN").format(trasladosN.elements[0].attributes.Importe), alignment: 'left', style: "textotablatotales"},
                    ],
                    [
                        {},
                        {},
                        {border: [false, false, true, true], text: "Total", alignment: 'left', style: "textotablatotales"},
                        {border: [false, false, true, true], text:  "$" + Intl.NumberFormat("en-IN").format(attributes.Total), alignment: 'left', style: "textotablatotales"},
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
                    return 'black';
                },
                vLineColor: function () {
                    return 'black';
                },
            }	
        }

        //Para poner el regimen fiscal en el pie de página
        var paramsRegimenFiscal = {
            pvOptionCRUD: "R",
            pvIdCatalog: emisor.attributes.RegimenFiscal,
            table: "SAT_Cat_Tax_Regimens"
        }

        var resRegimenFiscal = await dbcatcatalogs.getCatalogIdDescription(paramsRegimenFiscal)

        var docDefinition = {
            pageMargins: [ 25, 10, 25, 50 ],
            footer: function(currentPage, pageCount) {
                return {
                    margin: [ 30, 0, 30, 30 ],
                    columns: [
                        {
                            width: "*",
                            text: 'Este documento es una representación impresa de un CFDI. Régimen fiscal emisor: ' + emisor.attributes.RegimenFiscal + ' ' +  resRegimenFiscal + '\nFolio Fiscal: ' + timbreFiscal.attributes.UUID + ' Fecha de certificación: ' + timbreFiscal.attributes.FechaTimbrado  + '\nCertificado del emisor: ' + attributes.NoCertificado + ' Certificado del SAT: ' + timbreFiscal.attributes.NoCertificadoSAT + ' Consulta nuestro aviso de privacidad en www.itwpolymex.com', style: 'footer', alignment: 'left'
                        },
                        {
                            width: 90,
                            text: 'Página ' + currentPage.toString() + ' de ' + pageCount, style: 'footer', alignment: 'right'
                        },
                    ]
                }
            },
            content: [
                encabezado,
                "\n",
                emisorReceptor,
                tipoComprobante,
                condiciones,
                vendedor,
                "\n",
                conceptosTable,
                "\n",
                leyendasF,
                "\n",
                norma,
                "\n",
                cadenasTable, 
                "\n",
                codigos
                
            ],
            pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
                return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
            },
            styles: {
                textoinvisible: {
                    fontSize: 2,
                    color: '#ffffff',
                },
                encabezadoRfc: {
                    fontSize: 10,
                    bold: true,
                    color: '#bd8635',
                },
                encabezadoDomicilio: {
                    fontSize: 10,
                    color: '#000000',
                },
                encabezadoTexto: {
                    fontSize: 10,
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
                textotablacodigo: {
                    fontSize: 6.0,
                },
                textotablabold: {
                    fontSize: 12,
                    bold: true,
                    color: '#ffffff',
                },
                textotablaboldlarge: {
                    fontSize: 12,
                    bold: true,
                    color: '#000000',
                },
                textotablaboldblack: {
                    fontSize: 7,
                    bold: true,
                    color: '#000000',
                },
                textotablawhite: {
                    fontSize: 11,
                    color: '#ffffff',
                },
                textotablablack: {
                    fontSize: 11,
                },
                textotablaEmisorReceptor: {
                    fontSize: 9,
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
                },
                textotablatotales: {
                    fontSize: 8
                }
            }   
        };

        var pdfDoc = printer.createPdfKitDocument(docDefinition);
        pdfDoc.pipe(fs.createWriteStream("Documento.pdf"));
        pdfDoc.end();

        
        return new Promise( ( resolve, reject ) => {

            var pdfDoc = printer.createPdfKitDocument(docDefinition);
            fs.unlinkSync(temporalFilesPath + imageQR)

            var chunks = [];
            var base64 = '';

            pdfDoc.on('data', function (chunk) {
                chunks.push(chunk);
            });
            
            pdfDoc.on('end', function () {

                result = Buffer.concat(chunks);

                base64 = result.toString('base64');

                var result = {
                    pdfBase64: base64,
                    emailTo : arrayEmailTo,
                    emailCC: arrayEmailCC
                }
                resolve(result);

            });

            pdfDoc.on('error', (error) => {
                
                console.log(error);
                
                reject('')

            });

            pdfDoc.end();

        });

    } catch (err) {

        console.error('Error: ', err)

    }
    
}

//getPDFPolymex(xml642, "/Users/alexishernandezolvera/Desktop/IPM6203226B4_TEST_22031701_20220308.txt", "/Users/alexishernandezolvera/Desktop/GTC/PROYECTOS/gtc-services-portal-api/utils/images/Logo_Polymex.png")

var numeroALetras = (function() {
    
    function Unidades(num) {

        switch (num) {
            case 1:
                return 'UN';
            case 2:
                return 'DOS';
            case 3:
                return 'TRES';
            case 4:
                return 'CUATRO';
            case 5:
                return 'CINCO';
            case 6:
                return 'SEIS';
            case 7:
                return 'SIETE';
            case 8:
                return 'OCHO';
            case 9:
                return 'NUEVE';
        }

        return '';
    } //Unidades()

    function Decenas(num) {

        let decena = Math.floor(num / 10);
        let unidad = num - (decena * 10);

        switch (decena) {
            case 1:
                switch (unidad) {
                    case 0:
                        return 'DIEZ';
                    case 1:
                        return 'ONCE';
                    case 2:
                        return 'DOCE';
                    case 3:
                        return 'TRECE';
                    case 4:
                        return 'CATORCE';
                    case 5:
                        return 'QUINCE';
                    default:
                        return 'DIECI' + Unidades(unidad);
                }
            case 2:
                switch (unidad) {
                    case 0:
                        return 'VEINTE';
                    default:
                        return 'VEINTI' + Unidades(unidad);
                }
            case 3:
                return DecenasY('TREINTA', unidad);
            case 4:
                return DecenasY('CUARENTA', unidad);
            case 5:
                return DecenasY('CINCUENTA', unidad);
            case 6:
                return DecenasY('SESENTA', unidad);
            case 7:
                return DecenasY('SETENTA', unidad);
            case 8:
                return DecenasY('OCHENTA', unidad);
            case 9:
                return DecenasY('NOVENTA', unidad);
            case 0:
                return Unidades(unidad);
        }
    } //Unidades()

    function DecenasY(strSin, numUnidades) {
        if (numUnidades > 0)
            return strSin + ' Y ' + Unidades(numUnidades)

        return strSin;
    } //DecenasY()

    function Centenas(num) {
        let centenas = Math.floor(num / 100);
        let decenas = num - (centenas * 100);

        switch (centenas) {
            case 1:
                if (decenas > 0)
                    return 'CIENTO ' + Decenas(decenas);
                return 'CIEN';
            case 2:
                return 'DOSCIENTOS ' + Decenas(decenas);
            case 3:
                return 'TRESCIENTOS ' + Decenas(decenas);
            case 4:
                return 'CUATROCIENTOS ' + Decenas(decenas);
            case 5:
                return 'QUINIENTOS ' + Decenas(decenas);
            case 6:
                return 'SEISCIENTOS ' + Decenas(decenas);
            case 7:
                return 'SETECIENTOS ' + Decenas(decenas);
            case 8:
                return 'OCHOCIENTOS ' + Decenas(decenas);
            case 9:
                return 'NOVECIENTOS ' + Decenas(decenas);
        }

        return Decenas(decenas);
    } //Centenas()

    function Seccion(num, divisor, strSingular, strPlural) {
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let letras = '';

        if (cientos > 0)
            if (cientos > 1)
                letras = Centenas(cientos) + ' ' + strPlural;
            else
                letras = strSingular;

        if (resto > 0)
            letras += '';

        return letras;
    } //Seccion()

    function Miles(num) {
        let divisor = 1000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
        let strCentenas = Centenas(resto);

        if (strMiles == '')
            return strCentenas;

        return strMiles + ' ' + strCentenas;
    } //Miles()

    function Millones(num) {
        let divisor = 1000000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let strMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE');
        let strMiles = Miles(resto);

        if (strMillones == '')
            return strMiles;

        return strMillones + ' ' + strMiles;
    } //Millones()

    return function NumeroALetras(num, currency) {
        currency = currency || {};
        let data = {
            numero: num,
            enteros: Math.floor(num),
            centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
            letrasCentavos: '',
            letrasMonedaPlural: currency.plural, 
            letrasMonedaSingular: currency.singular, 
            letrasMonedaCentavoPlural: currency.centPlural,
            letrasMonedaCentavoSingular: currency.centSingular
        };

        /*if (data.centavos > 0) {
            data.letrasCentavos = 'CON ' + (function() {
                if (data.centavos == 1)
                    return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
                else
                    return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
            })();
        };*/

        data.letrasCentavos = data.centavos+"/100"

        if (data.enteros == 0)
            return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
        if (data.enteros == 1)
            return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
        else
            return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
    };

})();

module.exports = {
    getPDFPolymex : getPDFPolymex
}