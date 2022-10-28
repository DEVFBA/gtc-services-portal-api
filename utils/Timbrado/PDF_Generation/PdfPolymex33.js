/*var fonts = {
    Roboto: {
      normal: 'C:/GTC/Fonts/Roboto-Regular.ttf',
      bold: 'C:/GTC/Fonts/Roboto-Bold.ttf',
      italics: 'C:/GTC/Fonts/Montserrat-Italic.ttf',
      bolditalics: 'C:/GTC/Fonts/Montserrat-BoldItalic.ttf'
    }
}*/


var fonts = {
    Roboto: {
      normal: '/Users/alexishernandezolvera/Desktop/GTC/PROYECTOS/gtc-services-portal-api/utils/fonts/Roboto-Regular.ttf',
      bold: '/Users/alexishernandezolvera/Desktop/GTC/PROYECTOS/gtc-services-portal-api/utils/fonts/Roboto-Bold.ttf',
      italics: '/Users/alexishernandezolvera/Desktop/GTC/PROYECTOS/gtc-services-portal-api/utils/fonts/Montserrat-Italic.ttf',
      bolditalics: '/Users/alexishernandezolvera/Desktop/GTC/PROYECTOS/gtc-services-portal-api/utils/fonts/Montserrat-BoldItalic.ttf'
    }
};

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

var IPM6203226B4_RM_9881_20221026 = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPGNmZGk6Q29tcHJvYmFudGUgeG1sbnM6Y2ZkaT0iaHR0cDovL3d3dy5zYXQuZ29iLm14L2NmZC8zIgogICAgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgQ2VydGlmaWNhZG89Ik1JSUdEVENDQS9XZ0F3SUJBZ0lVTURBd01ERXdNREF3TURBMU1UTTJNakkwTURZd0RRWUpLb1pJaHZjTkFRRUxCUUF3Z2dHRU1TQXdIZ1lEVlFRRERCZEJWVlJQVWtsRVFVUWdRMFZTVkVsR1NVTkJSRTlTUVRFdU1Dd0dBMVVFQ2d3bFUwVlNWa2xEU1U4Z1JFVWdRVVJOU1U1SlUxUlNRVU5KVDA0Z1ZGSkpRbFZVUVZKSlFURWFNQmdHQTFVRUN3d1JVMEZVTFVsRlV5QkJkWFJvYjNKcGRIa3hLakFvQmdrcWhraUc5dzBCQ1FFV0cyTnZiblJoWTNSdkxuUmxZMjVwWTI5QWMyRjBMbWR2WWk1dGVERW1NQ1FHQTFVRUNRd2RRVll1SUVoSlJFRk1SMDhnTnpjc0lFTlBUQzRnUjFWRlVsSkZVazh4RGpBTUJnTlZCQkVNQlRBMk16QXdNUXN3Q1FZRFZRUUdFd0pOV0RFWk1CY0dBMVVFQ0F3UVEwbFZSRUZFSUVSRklFMUZXRWxEVHpFVE1CRUdBMVVFQnd3S1ExVkJWVWhVUlUxUFF6RVZNQk1HQTFVRUxSTU1VMEZVT1Rjd056QXhUazR6TVZ3d1dnWUpLb1pJaHZjTkFRa0NFMDF5WlhOd2IyNXpZV0pzWlRvZ1FVUk5TVTVKVTFSU1FVTkpUMDRnUTBWT1ZGSkJUQ0JFUlNCVFJWSldTVU5KVDFNZ1ZGSkpRbFZVUVZKSlQxTWdRVXdnUTA5T1ZGSkpRbFZaUlU1VVJUQWVGdzB5TWpBMk1qUXhOVEEyTVRKYUZ3MHlOakEyTWpReE5UQTJNVEphTUlIYk1TTXdJUVlEVlFRREV4cEpWRmNnVUU5TVdTQk5SVmdnVXlCRVJTQlNUQ0JFUlNCRFZqRWpNQ0VHQTFVRUtSTWFTVlJYSUZCUFRGa2dUVVZZSUZNZ1JFVWdVa3dnUkVVZ1ExWXhJekFoQmdOVkJBb1RHa2xVVnlCUVQweFpJRTFGV0NCVElFUkZJRkpNSUVSRklFTldNU1V3SXdZRFZRUXRFeHhKVUUwMk1qQXpNakkyUWpRZ0x5QldRVkJGTnpFd016QTVOMW80TVI0d0hBWURWUVFGRXhVZ0x5QldRVkJGTnpFd09UQTVTRTFEVWxKRU1EQXhJekFoQmdOVkJBc1RHa2xVVnlCUVQweFpJRTFGV0NCVElFUkZJRkpNSUVSRklFTldNSUlCSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDQVFFQWswVjF6M1BSV3hpUmFVaFN0VHArSjZXUDlVQWk2ZTFOcFdSTnhjYlBpeDExVlUvY1ExRWpWa1VpMDFTNWJMU0VmQU9hZHoyNnVCL2dPUHRjc21EeXUvUGNpb1ZCTWJKZmxYNDNUTk9LSXlPNno5aHJPak1WRlphYUxOVWh6NTF4Z1JXYlphWjZVMkYvRlF1VUcvMEt5QUNtd1phMTZNRFRKZjlsNURmTWFLZ3NFMnVOZ2tIa1g4REVlOVdZRlVEVXdFT056VU94eU9OZUtjR2JMZ3pMWnFUb1NIZitKbEJTRzdLYzlkUVYwL0JtTkFGcFl5eC96dW5ENG9ES2JDVDZieGJKSmhnQlRLTVAvYTZSNkplZTk0SVFoeThKUTVHV1l3c0FJakh0L0VQMXRQTHFwTnVucnN6K01aMkV3Nk1Md1VVcEpFVzF1Szh3c0l4dmd5ckhId0lEQVFBQm94MHdHekFNQmdOVkhSTUJBZjhFQWpBQU1Bc0dBMVVkRHdRRUF3SUd3REFOQmdrcWhraUc5dzBCQVFzRkFBT0NBZ0VBcWdKVGNBUFdMejNWYkxCazg4d1ZCVjR5cnBwQldEb0dabUk2dFZnWmdINGordlhIcXhEUnNGNFd1cjRVenNaWGVYQmdlRm96QU82bGZkSXpTRGdCNDNwLy92ZjFyYmJkR01XazhOU09aOU1vRGF2UDZFendnUXdUR1RvSXNoVWlNeEJzV0M2QWZRWTN2Qm9pWVhlajh2VTFTVEF5LzVLdUZnZVdoZkhoNHNmNjBsS2l0N09LcVhUMEs2NnFSZUhvcHhNbGQyT0hvUC9abXRlMGIvUUxSZlR6VkZzb3hSRWpkQWNUOW16cURzTWNxRVhGWFQvQ1FpRHZWWCtRbk5lZlBQUlhZcGZGU3FWMngzV0hxUEZkNkpaczBoZWtyYTNGQXRFY09sRFNVbmY3UTFGTzhCYTlLS2VhSlJkVzI5SDU3MmNrL095aEUxOWF4OHpkWVVFdHg1SDRtK0EyODdHK3VPSTcvbU1qa2tUb1pLR2F6UWppVHV0YURHVjdneXo5UFNZcHB1ZkNQU2tGY2kvT0JPdUhWTnNPaEYzcXg2OWdLMTJnU2M4TS9aMHRNbWhOMGVCcURtdldTRmRkM3dWR0h0aTU5bDVWSEFCdUlEdjRob1M0eHJuS0V6blVMLzRGYVFwSDNxZzRoVnR6Y0hFNUxUY1ppalF1bnV0WUd0a1hOMFRtczJaeGlVODh4M1JsZ3g2R2FIbkwxbmJQYi9saUxKY2dSMFU0RitMZWxXUytJd3lpS3pRU3BsRFlSM1VBT0pkdnRTTjRrbHZBbDBya29rVVhsSUJOWTgzUWhHellyMytjdmJYOHFqMFhESm5YaWtJOEQ2QkE5STh6MWtIbkVMdTJPcG5pWVVyRGRVZHgzQU50anhQRHZ4bDFycDFPSHZVWFBYd1dRbmc9IiBGZWNoYT0iMjAyMi0xMC0yNlQxNTozMTowOSIgRm9saW89Ijk4ODEiIEZvcm1hUGFnbz0iOTkiIEx1Z2FyRXhwZWRpY2lvbj0iNjQ5ODgiIE1ldG9kb1BhZ289IlBVRSIgTW9uZWRhPSJNWE4iIE5vQ2VydGlmaWNhZG89IjAwMDAxMDAwMDAwNTEzNjIyNDA2IiBTZWxsbz0iZlZSL1RCQVNab3R4aFczak1KNjd0ZVI4ckpOc2N1MU5wSk9aZ25ReVdHbkR6cXA4eTNPT1RON1FJcGRIeWNNOHZWaHZ4OGU3a3Z4aUF1bFM2eFB6dTMyNkQreDIrM3VrendBSENZU1E5cG1nd0s3d0dSL1YrK29GUkJvbkw0ekpaVnZpekI4RTRMeUlmemcrSUVKcnJiaGRTeTVpTWMwMUZvZkR1T3Z5eFVtRHMxMVAyVDVkMXo3dkpjUGdjdTh6Vm5xUGpwUTZRRHN6RTZVZXdIQkhzbWFGSENCbE5idU5NYllKUDg2bHpGTU0wd2E3QnRiV1lwV1RTMmNXNmFwcm9rVTduUWZhR3QxNkJhR1NEWDZMOWlBbjJHVkVHY1RraTUxV3FVMGlRTGR5UmR0d2NPNEJLczhQbU1BY2ZYeUk4TG9kMUgzdlM4L0wwUys5S01VZ0tBPT0iIFNlcmllPSJSTSIgU3ViVG90YWw9Ijg3LjYxIiBUaXBvQ2FtYmlvPSIxIiBUaXBvRGVDb21wcm9iYW50ZT0iRSIgVG90YWw9IjEwMS42MyIgVmVyc2lvbj0iMy4zIiB4c2k6c2NoZW1hTG9jYXRpb249Imh0dHA6Ly93d3cuc2F0LmdvYi5teC9jZmQvMyBodHRwOi8vd3d3LnNhdC5nb2IubXgvc2l0aW9faW50ZXJuZXQvY2ZkLzMvY2ZkdjMzLnhzZCI+CiAgICA8Y2ZkaTpDZmRpUmVsYWNpb25hZG9zIFRpcG9SZWxhY2lvbj0iMDEiPgogICAgICAgIDxjZmRpOkNmZGlSZWxhY2lvbmFkbyBVVUlEPSIxMmI3ZGRjOC0zNmJiLTQ2M2EtODczNS1hMDdmZTQ4ZjhjZTUiIC8+CiAgICA8L2NmZGk6Q2ZkaVJlbGFjaW9uYWRvcz4KICAgIDxjZmRpOkVtaXNvciBOb21icmU9IklUVyBQb2x5bWV4IFMgREUgUkwgREUgQ1YiIFJlZ2ltZW5GaXNjYWw9IjYwMSIgUmZjPSJJUE02MjAzMjI2QjQiIC8+CiAgICA8Y2ZkaTpSZWNlcHRvciBOb21icmU9IlJFRkFDQ0lPTkFSSUEgRElOQU1JQ0EgREUgVEVIVUFDQU4gU0EgREVDViIgUmZjPSJSRFQ4ODAxMzE4VzciIFVzb0NGREk9IkcwMiIgLz4KICAgIDxjZmRpOkNvbmNlcHRvcz4KICAgICAgICA8Y2ZkaTpDb25jZXB0byBDYW50aWRhZD0iMSIgQ2xhdmVQcm9kU2Vydj0iODQxMTE1MDYiIENsYXZlVW5pZGFkPSJBQ1QiIERlc2NyaXBjaW9uPSJCT05JRklDQUNJT04iIEltcG9ydGU9Ijg3LjYxIiBOb0lkZW50aWZpY2FjaW9uPSJDTzA1IiBVbmlkYWQ9IkFjdGl2aWRhZCIgVmFsb3JVbml0YXJpbz0iODcuNjEwMCI+CiAgICAgICAgICAgIDxjZmRpOkltcHVlc3Rvcz4KICAgICAgICAgICAgICAgIDxjZmRpOlRyYXNsYWRvcz4KICAgICAgICAgICAgICAgICAgICA8Y2ZkaTpUcmFzbGFkbyBCYXNlPSI4Ny42MSIgSW1wb3J0ZT0iMTQuMDIiIEltcHVlc3RvPSIwMDIiIFRhc2FPQ3VvdGE9IjAuMTYwMDAwIiBUaXBvRmFjdG9yPSJUYXNhIiAvPgogICAgICAgICAgICAgICAgPC9jZmRpOlRyYXNsYWRvcz4KICAgICAgICAgICAgPC9jZmRpOkltcHVlc3Rvcz4KICAgICAgICA8L2NmZGk6Q29uY2VwdG8+CiAgICA8L2NmZGk6Q29uY2VwdG9zPgogICAgPGNmZGk6SW1wdWVzdG9zIFRvdGFsSW1wdWVzdG9zVHJhc2xhZGFkb3M9IjE0LjAyIj4KICAgICAgICA8Y2ZkaTpUcmFzbGFkb3M+CiAgICAgICAgICAgIDxjZmRpOlRyYXNsYWRvIEltcG9ydGU9IjE0LjAyIiBJbXB1ZXN0bz0iMDAyIiBUYXNhT0N1b3RhPSIwLjE2MDAwMCIgVGlwb0ZhY3Rvcj0iVGFzYSIgLz4KICAgICAgICA8L2NmZGk6VHJhc2xhZG9zPgogICAgPC9jZmRpOkltcHVlc3Rvcz4KICAgIDxjZmRpOkNvbXBsZW1lbnRvPgogICAgICAgIDx0ZmQ6VGltYnJlRmlzY2FsRGlnaXRhbCB4c2k6c2NoZW1hTG9jYXRpb249Imh0dHA6Ly93d3cuc2F0LmdvYi5teC9UaW1icmVGaXNjYWxEaWdpdGFsIGh0dHA6Ly93d3cuc2F0LmdvYi5teC9zaXRpb19pbnRlcm5ldC9jZmQvVGltYnJlRmlzY2FsRGlnaXRhbC9UaW1icmVGaXNjYWxEaWdpdGFsdjExLnhzZCIgVmVyc2lvbj0iMS4xIiBVVUlEPSJkMjg2ZTk3Ny1mMjlkLTQwNjAtYmM2ZC0wZDlhOTBiZjc3NTEiIEZlY2hhVGltYnJhZG89IjIwMjItMTAtMjZUMTg6MjA6MDMiIFJmY1Byb3ZDZXJ0aWY9IkxTTzEzMDYxODlSNSIgU2VsbG9DRkQ9ImZWUi9UQkFTWm90eGhXM2pNSjY3dGVSOHJKTnNjdTFOcEpPWmduUXlXR25EenFwOHkzT09UTjdRSXBkSHljTTh2Vmh2eDhlN2t2eGlBdWxTNnhQenUzMjZEK3gyKzN1a3p3QUhDWVNROXBtZ3dLN3dHUi9WKytvRlJCb25MNHpKWlZ2aXpCOEU0THlJZnpnK0lFSnJyYmhkU3k1aU1jMDFGb2ZEdU92eXhVbURzMTFQMlQ1ZDF6N3ZKY1BnY3U4elZucVBqcFE2UURzekU2VWV3SEJIc21hRkhDQmxOYnVOTWJZSlA4Nmx6Rk1NMHdhN0J0YldZcFdUUzJjVzZhcHJva1U3blFmYUd0MTZCYUdTRFg2TDlpQW4yR1ZFR2NUa2k1MVdxVTBpUUxkeVJkdHdjTzRCS3M4UG1NQWNmWHlJOExvZDFIM3ZTOC9MMFMrOUtNVWdLQT09IiBOb0NlcnRpZmljYWRvU0FUPSIwMDAwMTAwMDAwMDUwOTg0NjY2MyIgU2VsbG9TQVQ9ImJxZUZCRVRCNGRzZXNYcENhcjBSbjFGNjk0WTh3amNhL1JicWY2OTF4d2FFamVMc0JEcWNzNWpHWnNSTlF2bVhHbDRUUnFvMVd3SHZYZTZJcTAyMk1nWUJwcklFRUZDejFNREo3U251dlZ3bi83bVArQ2dPbXF5SVNwRzRTUG5IbXBRbUtoYjl1S2FoTHllT21tUjFaeXp4MkRNTXhNZngvQk9pOSt5TDA3cWVFdjVsUEx1UUhtWEVUNzhRQXhzL1pTK2xZL1JDeCttUWpFU0ZVekk5dW9UMWltZ25iOWVSZlRkVGc3QlNyZ1lsZmpFWTdZbGFRSzBGa21iQnVnY2h4eG5Nclp0VXllNXJNcE9qSzl0ZWR3YlFHOGgrTEY2b3dPNG5xUWZ0aXRDWWZid2xJMXdxVWNrVDhIUFhaYU9JaGdMeEZqS25kUlFyT3g5ZGVQWVBGZz09IgogICAgICAgICAgICB4bWxuczp0ZmQ9Imh0dHA6Ly93d3cuc2F0LmdvYi5teC9UaW1icmVGaXNjYWxEaWdpdGFsIgogICAgICAgICAgICB4bWxuczp4c2k9Imh0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hLWluc3RhbmNlIiAvPgogICAgPC9jZmRpOkNvbXBsZW1lbnRvPgo8L2NmZGk6Q29tcHJvYmFudGU+"
var IPM6203226B4_CFDI_RM9882_20221026 = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPGNmZGk6Q29tcHJvYmFudGUgeG1sbnM6Y2ZkaT0iaHR0cDovL3d3dy5zYXQuZ29iLm14L2NmZC8zIgogICAgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgQ2VydGlmaWNhZG89Ik1JSUdEVENDQS9XZ0F3SUJBZ0lVTURBd01ERXdNREF3TURBMU1UTTJNakkwTURZd0RRWUpLb1pJaHZjTkFRRUxCUUF3Z2dHRU1TQXdIZ1lEVlFRRERCZEJWVlJQVWtsRVFVUWdRMFZTVkVsR1NVTkJSRTlTUVRFdU1Dd0dBMVVFQ2d3bFUwVlNWa2xEU1U4Z1JFVWdRVVJOU1U1SlUxUlNRVU5KVDA0Z1ZGSkpRbFZVUVZKSlFURWFNQmdHQTFVRUN3d1JVMEZVTFVsRlV5QkJkWFJvYjNKcGRIa3hLakFvQmdrcWhraUc5dzBCQ1FFV0cyTnZiblJoWTNSdkxuUmxZMjVwWTI5QWMyRjBMbWR2WWk1dGVERW1NQ1FHQTFVRUNRd2RRVll1SUVoSlJFRk1SMDhnTnpjc0lFTlBUQzRnUjFWRlVsSkZVazh4RGpBTUJnTlZCQkVNQlRBMk16QXdNUXN3Q1FZRFZRUUdFd0pOV0RFWk1CY0dBMVVFQ0F3UVEwbFZSRUZFSUVSRklFMUZXRWxEVHpFVE1CRUdBMVVFQnd3S1ExVkJWVWhVUlUxUFF6RVZNQk1HQTFVRUxSTU1VMEZVT1Rjd056QXhUazR6TVZ3d1dnWUpLb1pJaHZjTkFRa0NFMDF5WlhOd2IyNXpZV0pzWlRvZ1FVUk5TVTVKVTFSU1FVTkpUMDRnUTBWT1ZGSkJUQ0JFUlNCVFJWSldTVU5KVDFNZ1ZGSkpRbFZVUVZKSlQxTWdRVXdnUTA5T1ZGSkpRbFZaUlU1VVJUQWVGdzB5TWpBMk1qUXhOVEEyTVRKYUZ3MHlOakEyTWpReE5UQTJNVEphTUlIYk1TTXdJUVlEVlFRREV4cEpWRmNnVUU5TVdTQk5SVmdnVXlCRVJTQlNUQ0JFUlNCRFZqRWpNQ0VHQTFVRUtSTWFTVlJYSUZCUFRGa2dUVVZZSUZNZ1JFVWdVa3dnUkVVZ1ExWXhJekFoQmdOVkJBb1RHa2xVVnlCUVQweFpJRTFGV0NCVElFUkZJRkpNSUVSRklFTldNU1V3SXdZRFZRUXRFeHhKVUUwMk1qQXpNakkyUWpRZ0x5QldRVkJGTnpFd016QTVOMW80TVI0d0hBWURWUVFGRXhVZ0x5QldRVkJGTnpFd09UQTVTRTFEVWxKRU1EQXhJekFoQmdOVkJBc1RHa2xVVnlCUVQweFpJRTFGV0NCVElFUkZJRkpNSUVSRklFTldNSUlCSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDQVFFQWswVjF6M1BSV3hpUmFVaFN0VHArSjZXUDlVQWk2ZTFOcFdSTnhjYlBpeDExVlUvY1ExRWpWa1VpMDFTNWJMU0VmQU9hZHoyNnVCL2dPUHRjc21EeXUvUGNpb1ZCTWJKZmxYNDNUTk9LSXlPNno5aHJPak1WRlphYUxOVWh6NTF4Z1JXYlphWjZVMkYvRlF1VUcvMEt5QUNtd1phMTZNRFRKZjlsNURmTWFLZ3NFMnVOZ2tIa1g4REVlOVdZRlVEVXdFT056VU94eU9OZUtjR2JMZ3pMWnFUb1NIZitKbEJTRzdLYzlkUVYwL0JtTkFGcFl5eC96dW5ENG9ES2JDVDZieGJKSmhnQlRLTVAvYTZSNkplZTk0SVFoeThKUTVHV1l3c0FJakh0L0VQMXRQTHFwTnVucnN6K01aMkV3Nk1Md1VVcEpFVzF1Szh3c0l4dmd5ckhId0lEQVFBQm94MHdHekFNQmdOVkhSTUJBZjhFQWpBQU1Bc0dBMVVkRHdRRUF3SUd3REFOQmdrcWhraUc5dzBCQVFzRkFBT0NBZ0VBcWdKVGNBUFdMejNWYkxCazg4d1ZCVjR5cnBwQldEb0dabUk2dFZnWmdINGordlhIcXhEUnNGNFd1cjRVenNaWGVYQmdlRm96QU82bGZkSXpTRGdCNDNwLy92ZjFyYmJkR01XazhOU09aOU1vRGF2UDZFendnUXdUR1RvSXNoVWlNeEJzV0M2QWZRWTN2Qm9pWVhlajh2VTFTVEF5LzVLdUZnZVdoZkhoNHNmNjBsS2l0N09LcVhUMEs2NnFSZUhvcHhNbGQyT0hvUC9abXRlMGIvUUxSZlR6VkZzb3hSRWpkQWNUOW16cURzTWNxRVhGWFQvQ1FpRHZWWCtRbk5lZlBQUlhZcGZGU3FWMngzV0hxUEZkNkpaczBoZWtyYTNGQXRFY09sRFNVbmY3UTFGTzhCYTlLS2VhSlJkVzI5SDU3MmNrL095aEUxOWF4OHpkWVVFdHg1SDRtK0EyODdHK3VPSTcvbU1qa2tUb1pLR2F6UWppVHV0YURHVjdneXo5UFNZcHB1ZkNQU2tGY2kvT0JPdUhWTnNPaEYzcXg2OWdLMTJnU2M4TS9aMHRNbWhOMGVCcURtdldTRmRkM3dWR0h0aTU5bDVWSEFCdUlEdjRob1M0eHJuS0V6blVMLzRGYVFwSDNxZzRoVnR6Y0hFNUxUY1ppalF1bnV0WUd0a1hOMFRtczJaeGlVODh4M1JsZ3g2R2FIbkwxbmJQYi9saUxKY2dSMFU0RitMZWxXUytJd3lpS3pRU3BsRFlSM1VBT0pkdnRTTjRrbHZBbDBya29rVVhsSUJOWTgzUWhHellyMytjdmJYOHFqMFhESm5YaWtJOEQ2QkE5STh6MWtIbkVMdTJPcG5pWVVyRGRVZHgzQU50anhQRHZ4bDFycDFPSHZVWFBYd1dRbmc9IiBGZWNoYT0iMjAyMi0xMC0yNlQxNTozMToxMCIgRm9saW89Ijk4ODIiIEZvcm1hUGFnbz0iOTkiIEx1Z2FyRXhwZWRpY2lvbj0iNjQ5ODgiIE1ldG9kb1BhZ289IlBVRSIgTW9uZWRhPSJNWE4iIE5vQ2VydGlmaWNhZG89IjAwMDAxMDAwMDAwNTEzNjIyNDA2IiBTZWxsbz0iT2x0TXRmZGlqbXRwWkNDakJkaFQ0QWpTMC8vMmVnWTZ3TGFRMEowNkZ6NFRaTy9KVnFzL1ZXT1BabW5SZUJXNzlkVk1adlhuYlhUdnczQTlEN2VwVHg0UkNDcCtidTdUUGoyYTFqVzJBaEYzVEozMzgrbEJrNTlIOU9Vc3lYWEZpV0RVdjFUS3k0Q1h2R2ZXWXBQbitQaDVLQm9UcmFMdDQxRFBTTGlFRHJpaHUzNENQdUNhKy9zL2YySmpkZWlrZVhuRkdwem1NQ0REa3JvZDBnNHRRdjZ6SXhISGZZeU9CejFZS0cyb2Vtc1k3NVJlMlNpUHQzMUtXbkV4MVphaUdTaWsxeFlNUFg5OWZGMitFZ1NpcEdPNWI5NEtJRmZBSnpVVnlnRVhzY1FVOXM2YmFZcTVSZ0FNZlZMQ0JMMUFoV1orS05Ia3F2Z0hCMno1RVF5dmlRPT0iIFNlcmllPSJSTSIgU3ViVG90YWw9IjQwLjY0IiBUaXBvQ2FtYmlvPSIxIiBUaXBvRGVDb21wcm9iYW50ZT0iRSIgVG90YWw9IjQ3LjE0IiBWZXJzaW9uPSIzLjMiIHhzaTpzY2hlbWFMb2NhdGlvbj0iaHR0cDovL3d3dy5zYXQuZ29iLm14L2NmZC8zIGh0dHA6Ly93d3cuc2F0LmdvYi5teC9zaXRpb19pbnRlcm5ldC9jZmQvMy9jZmR2MzMueHNkIj4KICAgIDxjZmRpOkNmZGlSZWxhY2lvbmFkb3MgVGlwb1JlbGFjaW9uPSIwMSI+CiAgICAgICAgPGNmZGk6Q2ZkaVJlbGFjaW9uYWRvIFVVSUQ9IjEyYjdkZGM4LTM2YmItNDYzYS04NzM1LWEwN2ZlNDhmOGNlNSIgLz4KICAgIDwvY2ZkaTpDZmRpUmVsYWNpb25hZG9zPgogICAgPGNmZGk6RW1pc29yIE5vbWJyZT0iSVRXIFBvbHltZXggUyBERSBSTCBERSBDViIgUmVnaW1lbkZpc2NhbD0iNjAxIiBSZmM9IklQTTYyMDMyMjZCNCIgLz4KICAgIDxjZmRpOlJlY2VwdG9yIE5vbWJyZT0iUkVGQUNDSU9OQVJJQSBESU5BTUlDQSBERSBURUhVQUNBTiBTQSBERUNWIiBSZmM9IlJEVDg4MDEzMThXNyIgVXNvQ0ZEST0iRzAyIiAvPgogICAgPGNmZGk6Q29uY2VwdG9zPgogICAgICAgIDxjZmRpOkNvbmNlcHRvIENhbnRpZGFkPSIxIiBDbGF2ZVByb2RTZXJ2PSI4NDExMTUwNiIgQ2xhdmVVbmlkYWQ9IkFDVCIgRGVzY3JpcGNpb249IkJPTklGSUNBQ0lPTiIgSW1wb3J0ZT0iNDAuNjQiIE5vSWRlbnRpZmljYWNpb249IkNPMDUiIFVuaWRhZD0iQWN0aXZpZGFkIiBWYWxvclVuaXRhcmlvPSI0MC42NDAwIj4KICAgICAgICAgICAgPGNmZGk6SW1wdWVzdG9zPgogICAgICAgICAgICAgICAgPGNmZGk6VHJhc2xhZG9zPgogICAgICAgICAgICAgICAgICAgIDxjZmRpOlRyYXNsYWRvIEJhc2U9IjQwLjY0IiBJbXBvcnRlPSI2LjUwIiBJbXB1ZXN0bz0iMDAyIiBUYXNhT0N1b3RhPSIwLjE2MDAwMCIgVGlwb0ZhY3Rvcj0iVGFzYSIgLz4KICAgICAgICAgICAgICAgIDwvY2ZkaTpUcmFzbGFkb3M+CiAgICAgICAgICAgIDwvY2ZkaTpJbXB1ZXN0b3M+CiAgICAgICAgPC9jZmRpOkNvbmNlcHRvPgogICAgPC9jZmRpOkNvbmNlcHRvcz4KICAgIDxjZmRpOkltcHVlc3RvcyBUb3RhbEltcHVlc3Rvc1RyYXNsYWRhZG9zPSI2LjUiPgogICAgICAgIDxjZmRpOlRyYXNsYWRvcz4KICAgICAgICAgICAgPGNmZGk6VHJhc2xhZG8gSW1wb3J0ZT0iNi41MCIgSW1wdWVzdG89IjAwMiIgVGFzYU9DdW90YT0iMC4xNjAwMDAiIFRpcG9GYWN0b3I9IlRhc2EiIC8+CiAgICAgICAgPC9jZmRpOlRyYXNsYWRvcz4KICAgIDwvY2ZkaTpJbXB1ZXN0b3M+CiAgICA8Y2ZkaTpDb21wbGVtZW50bz4KICAgICAgICA8dGZkOlRpbWJyZUZpc2NhbERpZ2l0YWwgeHNpOnNjaGVtYUxvY2F0aW9uPSJodHRwOi8vd3d3LnNhdC5nb2IubXgvVGltYnJlRmlzY2FsRGlnaXRhbCBodHRwOi8vd3d3LnNhdC5nb2IubXgvc2l0aW9faW50ZXJuZXQvY2ZkL1RpbWJyZUZpc2NhbERpZ2l0YWwvVGltYnJlRmlzY2FsRGlnaXRhbHYxMS54c2QiIFZlcnNpb249IjEuMSIgVVVJRD0iMDA3ZTVlMTgtZWU4Yi00NTg0LWI0ZDgtYWY5M2RlNTQ4ZjRkIiBGZWNoYVRpbWJyYWRvPSIyMDIyLTEwLTI2VDE4OjIwOjA2IiBSZmNQcm92Q2VydGlmPSJMU08xMzA2MTg5UjUiIFNlbGxvQ0ZEPSJPbHRNdGZkaWptdHBaQ0NqQmRoVDRBalMwLy8yZWdZNndMYVEwSjA2Rno0VFpPL0pWcXMvVldPUFptblJlQlc3OWRWTVp2WG5iWFR2dzNBOUQ3ZXBUeDRSQ0NwK2J1N1RQajJhMWpXMkFoRjNUSjMzOCtsQms1OUg5T1VzeVhYRmlXRFV2MVRLeTRDWHZHZldZcFBuK1BoNUtCb1RyYUx0NDFEUFNMaUVEcmlodTM0Q1B1Q2ErL3MvZjJKamRlaWtlWG5GR3B6bU1DRERrcm9kMGc0dFF2NnpJeEhIZll5T0J6MVlLRzJvZW1zWTc1UmUyU2lQdDMxS1duRXgxWmFpR1NpazF4WU1QWDk5ZkYyK0VnU2lwR081Yjk0S0lGZkFKelVWeWdFWHNjUVU5czZiYVlxNVJnQU1mVkxDQkwxQWhXWitLTkhrcXZnSEIyejVFUXl2aVE9PSIgTm9DZXJ0aWZpY2Fkb1NBVD0iMDAwMDEwMDAwMDA1MDk4NDY2NjMiIFNlbGxvU0FUPSJJeGFTTHdPYUV3YURUclZTdEx0Nm9FVUpScUVYODZNTGQ4bTZHd3J1MlExYjdyajdVLzVLV0YwZVJPK2xIMGVZQzNJWXh1MEllK1JNS2RFSTdLSUp6QllMYnpTdndWZVNTYU9XMUU5dzF0bng5M1Rsd3ZhejMwd3JDKzkwKzhjMTB1REJiUm9rK003eDIrMHVBenNGMjRsQWRxRHhSaSs0dWJudlVsWXI1bFVUNHpIaWNGcEkxdG92REdmRjQyOFIybXBsajUvbW5WZ2ZpZTVjeHRJRGxnaUJjS2RXQVNtaEFBbUNkK3ZyYzZlV3NEclM3bFlEQy9MYmp1TFhpdE1wTGRmZU1MZTVIS3UwdFJZMDRKQitoL3FiVVlzUmc4Z2tIZytSVGk3d2xEbDZMcmU4THUyd3k4UDdXVEVtU1lldjlRNEloYWhWZmZKell1M3o1akJ0TVE9PSIKICAgICAgICAgICAgeG1sbnM6dGZkPSJodHRwOi8vd3d3LnNhdC5nb2IubXgvVGltYnJlRmlzY2FsRGlnaXRhbCIKICAgICAgICAgICAgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgLz4KICAgIDwvY2ZkaTpDb21wbGVtZW50bz4KPC9jZmRpOkNvbXByb2JhbnRlPg=="
var IPM6203226B4_CFDI_RM9883_20221026 = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPGNmZGk6Q29tcHJvYmFudGUgeG1sbnM6Y2ZkaT0iaHR0cDovL3d3dy5zYXQuZ29iLm14L2NmZC8zIgogICAgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgQ2VydGlmaWNhZG89Ik1JSUdEVENDQS9XZ0F3SUJBZ0lVTURBd01ERXdNREF3TURBMU1UTTJNakkwTURZd0RRWUpLb1pJaHZjTkFRRUxCUUF3Z2dHRU1TQXdIZ1lEVlFRRERCZEJWVlJQVWtsRVFVUWdRMFZTVkVsR1NVTkJSRTlTUVRFdU1Dd0dBMVVFQ2d3bFUwVlNWa2xEU1U4Z1JFVWdRVVJOU1U1SlUxUlNRVU5KVDA0Z1ZGSkpRbFZVUVZKSlFURWFNQmdHQTFVRUN3d1JVMEZVTFVsRlV5QkJkWFJvYjNKcGRIa3hLakFvQmdrcWhraUc5dzBCQ1FFV0cyTnZiblJoWTNSdkxuUmxZMjVwWTI5QWMyRjBMbWR2WWk1dGVERW1NQ1FHQTFVRUNRd2RRVll1SUVoSlJFRk1SMDhnTnpjc0lFTlBUQzRnUjFWRlVsSkZVazh4RGpBTUJnTlZCQkVNQlRBMk16QXdNUXN3Q1FZRFZRUUdFd0pOV0RFWk1CY0dBMVVFQ0F3UVEwbFZSRUZFSUVSRklFMUZXRWxEVHpFVE1CRUdBMVVFQnd3S1ExVkJWVWhVUlUxUFF6RVZNQk1HQTFVRUxSTU1VMEZVT1Rjd056QXhUazR6TVZ3d1dnWUpLb1pJaHZjTkFRa0NFMDF5WlhOd2IyNXpZV0pzWlRvZ1FVUk5TVTVKVTFSU1FVTkpUMDRnUTBWT1ZGSkJUQ0JFUlNCVFJWSldTVU5KVDFNZ1ZGSkpRbFZVUVZKSlQxTWdRVXdnUTA5T1ZGSkpRbFZaUlU1VVJUQWVGdzB5TWpBMk1qUXhOVEEyTVRKYUZ3MHlOakEyTWpReE5UQTJNVEphTUlIYk1TTXdJUVlEVlFRREV4cEpWRmNnVUU5TVdTQk5SVmdnVXlCRVJTQlNUQ0JFUlNCRFZqRWpNQ0VHQTFVRUtSTWFTVlJYSUZCUFRGa2dUVVZZSUZNZ1JFVWdVa3dnUkVVZ1ExWXhJekFoQmdOVkJBb1RHa2xVVnlCUVQweFpJRTFGV0NCVElFUkZJRkpNSUVSRklFTldNU1V3SXdZRFZRUXRFeHhKVUUwMk1qQXpNakkyUWpRZ0x5QldRVkJGTnpFd016QTVOMW80TVI0d0hBWURWUVFGRXhVZ0x5QldRVkJGTnpFd09UQTVTRTFEVWxKRU1EQXhJekFoQmdOVkJBc1RHa2xVVnlCUVQweFpJRTFGV0NCVElFUkZJRkpNSUVSRklFTldNSUlCSWpBTkJna3Foa2lHOXcwQkFRRUZBQU9DQVE4QU1JSUJDZ0tDQVFFQWswVjF6M1BSV3hpUmFVaFN0VHArSjZXUDlVQWk2ZTFOcFdSTnhjYlBpeDExVlUvY1ExRWpWa1VpMDFTNWJMU0VmQU9hZHoyNnVCL2dPUHRjc21EeXUvUGNpb1ZCTWJKZmxYNDNUTk9LSXlPNno5aHJPak1WRlphYUxOVWh6NTF4Z1JXYlphWjZVMkYvRlF1VUcvMEt5QUNtd1phMTZNRFRKZjlsNURmTWFLZ3NFMnVOZ2tIa1g4REVlOVdZRlVEVXdFT056VU94eU9OZUtjR2JMZ3pMWnFUb1NIZitKbEJTRzdLYzlkUVYwL0JtTkFGcFl5eC96dW5ENG9ES2JDVDZieGJKSmhnQlRLTVAvYTZSNkplZTk0SVFoeThKUTVHV1l3c0FJakh0L0VQMXRQTHFwTnVucnN6K01aMkV3Nk1Md1VVcEpFVzF1Szh3c0l4dmd5ckhId0lEQVFBQm94MHdHekFNQmdOVkhSTUJBZjhFQWpBQU1Bc0dBMVVkRHdRRUF3SUd3REFOQmdrcWhraUc5dzBCQVFzRkFBT0NBZ0VBcWdKVGNBUFdMejNWYkxCazg4d1ZCVjR5cnBwQldEb0dabUk2dFZnWmdINGordlhIcXhEUnNGNFd1cjRVenNaWGVYQmdlRm96QU82bGZkSXpTRGdCNDNwLy92ZjFyYmJkR01XazhOU09aOU1vRGF2UDZFendnUXdUR1RvSXNoVWlNeEJzV0M2QWZRWTN2Qm9pWVhlajh2VTFTVEF5LzVLdUZnZVdoZkhoNHNmNjBsS2l0N09LcVhUMEs2NnFSZUhvcHhNbGQyT0hvUC9abXRlMGIvUUxSZlR6VkZzb3hSRWpkQWNUOW16cURzTWNxRVhGWFQvQ1FpRHZWWCtRbk5lZlBQUlhZcGZGU3FWMngzV0hxUEZkNkpaczBoZWtyYTNGQXRFY09sRFNVbmY3UTFGTzhCYTlLS2VhSlJkVzI5SDU3MmNrL095aEUxOWF4OHpkWVVFdHg1SDRtK0EyODdHK3VPSTcvbU1qa2tUb1pLR2F6UWppVHV0YURHVjdneXo5UFNZcHB1ZkNQU2tGY2kvT0JPdUhWTnNPaEYzcXg2OWdLMTJnU2M4TS9aMHRNbWhOMGVCcURtdldTRmRkM3dWR0h0aTU5bDVWSEFCdUlEdjRob1M0eHJuS0V6blVMLzRGYVFwSDNxZzRoVnR6Y0hFNUxUY1ppalF1bnV0WUd0a1hOMFRtczJaeGlVODh4M1JsZ3g2R2FIbkwxbmJQYi9saUxKY2dSMFU0RitMZWxXUytJd3lpS3pRU3BsRFlSM1VBT0pkdnRTTjRrbHZBbDBya29rVVhsSUJOWTgzUWhHellyMytjdmJYOHFqMFhESm5YaWtJOEQ2QkE5STh6MWtIbkVMdTJPcG5pWVVyRGRVZHgzQU50anhQRHZ4bDFycDFPSHZVWFBYd1dRbmc9IiBGZWNoYT0iMjAyMi0xMC0yNlQxNTozMToxMSIgRm9saW89Ijk4ODMiIEZvcm1hUGFnbz0iOTkiIEx1Z2FyRXhwZWRpY2lvbj0iNjQ5ODgiIE1ldG9kb1BhZ289IlBVRSIgTW9uZWRhPSJNWE4iIE5vQ2VydGlmaWNhZG89IjAwMDAxMDAwMDAwNTEzNjIyNDA2IiBTZWxsbz0iYkVPNFlGWFpBQlFBZVRXMmFPOWFvS0t6aFJEUEMycDl2eFZIUHVpZlBwL0dEbWV1RGVWT1JFV2xUQ1RmUDZoUitOUklQYy9jRjVLUllyOHE2VDVKSnJjdUpXb0JrbHgwd1l5NTJLU3dZOFdwMTBFUG5EeXJLT1hRTW5oWC9jNkNPUTNCeFhGR2JMOWNLbGZtZTdKU1g2ZEtNMUJUZFVEODZ4YlJ4eXgvUHA3aWs2Yi9PS0ZLeExBV3NpUXZyQ09FTUIrRHFpY0J6Q013OWdweGxtTUpDV1JXNGlsaHY2UnZSWGNyV2IvNXpxRWVZUjE0R1JqbXlQeVpXaE9IZXZhbzdRUnVmTzRGTFlOQlFFeVp1Mkh4UWR3RjYvSHVBSy9ZTURDSk1pQ3dGU201L0VWWk9xZHFDanZERys2WFRWRllXSy9QSnQxSTFWaDRzdG1TcVNBTEt3PT0iIFNlcmllPSJSTSIgU3ViVG90YWw9IjQ2LjcyIiBUaXBvQ2FtYmlvPSIxIiBUaXBvRGVDb21wcm9iYW50ZT0iRSIgVG90YWw9IjU0LjIiIFZlcnNpb249IjMuMyIgeHNpOnNjaGVtYUxvY2F0aW9uPSJodHRwOi8vd3d3LnNhdC5nb2IubXgvY2ZkLzMgaHR0cDovL3d3dy5zYXQuZ29iLm14L3NpdGlvX2ludGVybmV0L2NmZC8zL2NmZHYzMy54c2QiPgogICAgPGNmZGk6Q2ZkaVJlbGFjaW9uYWRvcyBUaXBvUmVsYWNpb249IjAxIj4KICAgICAgICA8Y2ZkaTpDZmRpUmVsYWNpb25hZG8gVVVJRD0iMTJiN2RkYzgtMzZiYi00NjNhLTg3MzUtYTA3ZmU0OGY4Y2U1IiAvPgogICAgPC9jZmRpOkNmZGlSZWxhY2lvbmFkb3M+CiAgICA8Y2ZkaTpFbWlzb3IgTm9tYnJlPSJJVFcgUG9seW1leCBTIERFIFJMIERFIENWIiBSZWdpbWVuRmlzY2FsPSI2MDEiIFJmYz0iSVBNNjIwMzIyNkI0IiAvPgogICAgPGNmZGk6UmVjZXB0b3IgTm9tYnJlPSJSRUZBQ0NJT05BUklBIERJTkFNSUNBIERFIFRFSFVBQ0FOIFNBIERFQ1YiIFJmYz0iUkRUODgwMTMxOFc3IiBVc29DRkRJPSJHMDIiIC8+CiAgICA8Y2ZkaTpDb25jZXB0b3M+CiAgICAgICAgPGNmZGk6Q29uY2VwdG8gQ2FudGlkYWQ9IjEiIENsYXZlUHJvZFNlcnY9Ijg0MTExNTA2IiBDbGF2ZVVuaWRhZD0iQUNUIiBEZXNjcmlwY2lvbj0iQk9OSUZJQ0FDSU9OIiBJbXBvcnRlPSI0Ni43MiIgTm9JZGVudGlmaWNhY2lvbj0iQ08wNSIgVW5pZGFkPSJBY3RpdmlkYWQiIFZhbG9yVW5pdGFyaW89IjQ2LjcyMDAiPgogICAgICAgICAgICA8Y2ZkaTpJbXB1ZXN0b3M+CiAgICAgICAgICAgICAgICA8Y2ZkaTpUcmFzbGFkb3M+CiAgICAgICAgICAgICAgICAgICAgPGNmZGk6VHJhc2xhZG8gQmFzZT0iNDYuNzIiIEltcG9ydGU9IjcuNDgiIEltcHVlc3RvPSIwMDIiIFRhc2FPQ3VvdGE9IjAuMTYwMDAwIiBUaXBvRmFjdG9yPSJUYXNhIiAvPgogICAgICAgICAgICAgICAgPC9jZmRpOlRyYXNsYWRvcz4KICAgICAgICAgICAgPC9jZmRpOkltcHVlc3Rvcz4KICAgICAgICA8L2NmZGk6Q29uY2VwdG8+CiAgICA8L2NmZGk6Q29uY2VwdG9zPgogICAgPGNmZGk6SW1wdWVzdG9zIFRvdGFsSW1wdWVzdG9zVHJhc2xhZGFkb3M9IjcuNDgiPgogICAgICAgIDxjZmRpOlRyYXNsYWRvcz4KICAgICAgICAgICAgPGNmZGk6VHJhc2xhZG8gSW1wb3J0ZT0iNy40OCIgSW1wdWVzdG89IjAwMiIgVGFzYU9DdW90YT0iMC4xNjAwMDAiIFRpcG9GYWN0b3I9IlRhc2EiIC8+CiAgICAgICAgPC9jZmRpOlRyYXNsYWRvcz4KICAgIDwvY2ZkaTpJbXB1ZXN0b3M+CiAgICA8Y2ZkaTpDb21wbGVtZW50bz4KICAgICAgICA8dGZkOlRpbWJyZUZpc2NhbERpZ2l0YWwgeHNpOnNjaGVtYUxvY2F0aW9uPSJodHRwOi8vd3d3LnNhdC5nb2IubXgvVGltYnJlRmlzY2FsRGlnaXRhbCBodHRwOi8vd3d3LnNhdC5nb2IubXgvc2l0aW9faW50ZXJuZXQvY2ZkL1RpbWJyZUZpc2NhbERpZ2l0YWwvVGltYnJlRmlzY2FsRGlnaXRhbHYxMS54c2QiIFZlcnNpb249IjEuMSIgVVVJRD0iMWQ5M2I1ODUtOGM5Zi00N2U0LTk1YzAtZmE4NWRkODM2N2Y1IiBGZWNoYVRpbWJyYWRvPSIyMDIyLTEwLTI2VDE4OjIwOjA3IiBSZmNQcm92Q2VydGlmPSJMU08xMzA2MTg5UjUiIFNlbGxvQ0ZEPSJiRU80WUZYWkFCUUFlVFcyYU85YW9LS3poUkRQQzJwOXZ4VkhQdWlmUHAvR0RtZXVEZVZPUkVXbFRDVGZQNmhSK05SSVBjL2NGNUtSWXI4cTZUNUpKcmN1SldvQmtseDB3WXk1MktTd1k4V3AxMEVQbkR5cktPWFFNbmhYL2M2Q09RM0J4WEZHYkw5Y0tsZm1lN0pTWDZkS00xQlRkVUQ4NnhiUnh5eC9QcDdpazZiL09LRkt4TEFXc2lRdnJDT0VNQitEcWljQnpDTXc5Z3B4bG1NSkNXUlc0aWxodjZSdlJYY3JXYi81enFFZVlSMTRHUmpteVB5WldoT0hldmFvN1FSdWZPNEZMWU5CUUV5WnUySHhRZHdGNi9IdUFLL1lNRENKTWlDd0ZTbTUvRVZaT3FkcUNqdkRHKzZYVFZGWVdLL1BKdDFJMVZoNHN0bVNxU0FMS3c9PSIgTm9DZXJ0aWZpY2Fkb1NBVD0iMDAwMDEwMDAwMDA1MDk4NDY2NjMiIFNlbGxvU0FUPSJLRnBkNTlWRjd6VkN4bXROV09YNTdUeVI4N3UvK0kyeUNLVWkyUHJJcFF3bENMajNmT2JQdGhVT0Z5RC9tSG5HS0oxNUg1TE04K002bmYyY2pWM0ZxMStQNFhaN0NaVnJKVnR2bGwxK29sUHNoSUovTXA2bU8rWjZzamU2YVpTcTRLcis0aERPVThxWUxmZnpKZWxIWWRlVlNZZjcvcEcwNXE0MHpMNjhFR09PSnoyQTlGRTZRcDQzNC9pOXZWYVJRUksxYm5mNkh4aTRQem5lNEl4b0loYlZqMGxId2ZxOGFWQkxidGJJZVMwOVpGYTE5ZEppREVHRHVoN0lUd2pKOGJEeVQ2c213M3ArclVXUFdkN0Y0NFBIMWRUckFnUVpnYjhZM2NqWTRvRHJqY2xHcnAzaFAxRlI5WUNrVU5OamdSNXl6S0trdy9FL2o0MWpJOHZEWFE9PSIKICAgICAgICAgICAgeG1sbnM6dGZkPSJodHRwOi8vd3d3LnNhdC5nb2IubXgvVGltYnJlRmlzY2FsRGlnaXRhbCIKICAgICAgICAgICAgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIgLz4KICAgIDwvY2ZkaTpDb21wbGVtZW50bz4KPC9jZmRpOkNvbXByb2JhbnRlPg=="


async function getPDFPolymex33(docBase64, txtDocument, pathLogo)
{

    try {

        logger.info('**************************************************************');
        logger.info('       Función getPDFPolymex33.');
        logger.info('**************************************************************');

        logger.info('Obteniendo la información del TXT');
        //Leo el archivo guardado anteriormente
        const txtString  = fs.readFileSync(txtDocument, 'utf-8');

        //Separamos el archivo por \r para obtener cada uno de los elementos.
        var arrayLineas = txtString.split("\n")
        
        logger.info('Obteniendo la información del TXT: emailTo');
        //Obtenemos el array de correos para emailTo
        var arrayEmailTo = arrayLineas[0].split(",")

        logger.info('Obteniendo la información del TXT: emailCC');
        //Obtenemos el array de correos para emailCC
        var arrayEmailCC = arrayLineas[1].split(",")

        logger.info('Obteniendo la información del TXT: encabezado');
        //Quitamos primer y último elemento de la cadena de parámetros encabezado.
        var params = arrayLineas[2].slice(1,-1)

        //Separamos los parámetros de encabezado por el caracter ^
        var paramsEncabezado = params.split("^")

        //Para obtener los lotes y piezas
        var lotesPiezas;

        //Para obtener los lotes
        var arrayLotes;

        //Para obtener las piezas
        var arrayPiezas;

        //Para obtener las referencias cruzadas
        var arrayRefCruzadas;

        var xmlString = await xml.serializeXML(docBase64)

        logger.info('Convirtiendo el archivo XML a json.');
        var options = {compact: false, ignoreComment: true, spaces: 4};
        const jsonString = convert.xml2json(xmlString, options);
        const jsonData = JSON.parse(jsonString)

        logger.info('Obteniendo la Información Global del xml.');
        var informacionGlobal =  jsonData.elements[0].elements.find( o => o.name === "cfdi:InformacionGlobal");

        logger.info('Obteniendo los Atributos del xml.');
        var attributes = jsonData.elements[0].attributes;

        logger.info('Obteniendo la información del Emisor');
        var emisor = jsonData.elements[0].elements.find( o => o.name === "cfdi:Emisor");

        logger.info('Obteniendo la información del Receptor');
        var receptor = jsonData.elements[0].elements.find( o => o.name === "cfdi:Receptor");

        logger.info('Obteniendo la información de los Conceptos');
        var conceptos = jsonData.elements[0].elements.find( o => o.name === "cfdi:Conceptos");

        logger.info('Obteniendo la información del Complemento');
        var complemento = jsonData.elements[0].elements.find( o => o.name === "cfdi:Complemento");



        if(attributes.TipoDeComprobante === "I" || attributes.TipoDeComprobante === "T" || attributes.TipoDeComprobante === "E")
        {
            lotesPiezas = arrayLineas[3].split("|")

            logger.info('Obteniendo la información del TXT: Lotes');
            //Para obtener los lotes
            arrayLotes = lotesPiezas[1].split("^")

            logger.info('Obteniendo la información del TXT: Piezas');
            //Para obtener las piezas
            arrayPiezas = lotesPiezas[2].split("^")

            logger.info('Obteniendo la información del TXT: Referencias Cruzadas');
            //Para obtener las referencias cruzadas
            arrayRefCruzadas = lotesPiezas[3].split("^")
        }

        //Condicionar la leyenda de exportación, si no viene no pintarla.
        var exportacion = "";
        if(attributes.Exportacion !== undefined)
        {
            let paramsExportacion = {
                pvOptionCRUD: "R",
                pvIdCatalog: attributes.Exportacion,
                table: "SAT_Cat_Export"
            }
    
            let resExportacion = await dbcatcatalogs.getCatalogIdDescription(paramsExportacion)

            exportacion = "Exportación: " + attributes.Exportacion + " - " + resExportacion + "\n"
        }

        var paramsRegimenFiscalEmisor = {
            pvOptionCRUD: "R",
            pvIdCatalog: emisor.attributes.RegimenFiscal,
            table: "SAT_Cat_Tax_Regimens"
        }

        var resRegimenFiscalEmisor = await dbcatcatalogs.getCatalogIdDescription(paramsRegimenFiscalEmisor);


        var datosEmisor = {
            text: [
                "\n",
                "\n",
                {text: emisor.attributes.Nombre + `\n`, style: 'header'},
                {text: "DOMICILIO FISCAL EMISOR\n", style: 'encabezadoTexto'},
                {text: paramsEncabezado[0] + " No. " + paramsEncabezado[1] + "\n", style: 'encabezadoTexto'},
                {text: paramsEncabezado[2] + "\n", style: 'encabezadoTexto'},
                {text: paramsEncabezado[3] + ", " + paramsEncabezado[4] +  " CP: " + paramsEncabezado[5] +  " " + paramsEncabezado[8] + "\n", style: 'encabezadoTexto'},
                {text: "Tel: " + paramsEncabezado[9] + "\n", style: 'encabezadoTexto'},
                {text: emisor.attributes.Rfc + `\n`, style: 'encabezadoTexto'},
                {text: "Lugar de expedición: " + attributes.LugarExpedicion + "\n", style: 'encabezadoTexto'},
                {text: "Régimen Fiscal: " + emisor.attributes.RegimenFiscal + " - " + resRegimenFiscalEmisor + "\n", style: 'encabezadoTexto'},
                {text: exportacion, style: 'encabezadoTexto'},
            ]
        }

        console.log("HASTA AQUI PASE")

        var textoEncabezado = "";
        if(attributes.TipoDeComprobante === "I" || attributes.TipoDeComprobante === "E")
        {
            textoEncabezado = "CFDI versión " + attributes.Version;
        }
        else if(attributes.TipoDeComprobante === "P")
        {
            let pago = complemento.elements.find( o => o.name === "pago20:Pagos");
            textoEncabezado = "Complemento de pago " + pago.attributes.Version;
        }
        else if(attributes.TipoDeComprobante === "T")
        {
            
            textoEncabezado = "Traslado " + attributes.Version;
        }

        var textoFactura = ""
        if(attributes.TipoDeComprobante === "I" || attributes.TipoDeComprobante === "T")
        {
            textoFactura = "Factura No.";
        }
        else if(attributes.TipoDeComprobante === "E")
        {
            textoFactura = "Nota de Cred.";
        }
        else if(attributes.TipoDeComprobante === "P")
        {
            textoFactura = "Pago No.";
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
                                    {fillColor: "#050583", text: textoEncabezado, alignment: 'center', style: 'textotablawhite'},
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
                                    {fillColor: "#050583", text: textoFactura, alignment: 'center', style: 'textotablawhite'},
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

        var domFiscal = ""
        if(receptor.attributes.DomicilioFiscalReceptor !== undefined)
        {
            domFiscal = receptor.attributes.DomicilioFiscalReceptor;
        }

        var regFiscal = ""
        if(receptor.attributes.RegimenFiscalReceptor !== undefined)
        {
            regFiscal = receptor.attributes.RegimenFiscalReceptor;

            var paramsRegimenFiscalReceptor = {
                pvOptionCRUD: "R",
                pvIdCatalog: receptor.attributes.RegimenFiscalReceptor,
                table: "SAT_Cat_Tax_Regimens"
            }
    
            var resRegimenFiscalReceptor = await dbcatcatalogs.getCatalogIdDescription(paramsRegimenFiscalReceptor);

            regFiscal = regFiscal + " - " + resRegimenFiscalReceptor
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
                                {text: "Domicilio Fiscal Receptor:" + `\n`, style: 'textotablaEmisorReceptor'},
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

        //Para armar la cadena de Periodicidad Mes / Año
        var periodicidadCadena = ""
        if(informacionGlobal !== undefined)
        {
            
            let paramsPeriodicidad = {
                pvOptionCRUD: "R",
                pvIdCatalog: informacionGlobal.attributes.Periodicidad,
                table: "SAT_Cat_Frequency"
            }
    
            let resPeriodicidad = await dbcatcatalogs.getCatalogIdDescription(paramsPeriodicidad);

            let paramsMes = {
                pvOptionCRUD: "R",
                pvIdCatalog: informacionGlobal.attributes.Meses,
                table: "SAT_Cat_Months"
            }
    
            let resMes = await dbcatcatalogs.getCatalogIdDescription(paramsMes);

            periodicidadCadena = resPeriodicidad + " " + resMes + " " + informacionGlobal.attributes.Año;
        }

        var tipoComprobante = {}
        var condiciones = {}
        var vendedor = {}
        var conceptosTable = {}
        var pagosTable = {}
        var cfdiRelTable = {}
        var comercioExteriorTable = {}
        var espacio1={}
        var cfdiRelacionadosLabel = "";
        var cfdiRelacionadosUUIDs = ""

        logger.info('Obteniendo la información de los CFDI Relacionados');
        var cfdiRelacionadosGeneral = jsonData.elements[0].elements.find( o => o.name === "cfdi:CfdiRelacionados")

        if(cfdiRelacionadosGeneral !== undefined)
        {
            let paramsCFDIRelacionados = {
                pvOptionCRUD: "R",
                pvIdCatalog: cfdiRelacionadosGeneral.attributes.TipoRelacion,
                table: "SAT_Cat_Relationship_Types"
            }
    
            let resCFDIRelacionados = await dbcatcatalogs.getCatalogIdDescription(paramsCFDIRelacionados);
            cfdiRelacionadosLabel = cfdiRelacionadosGeneral.attributes.TipoRelacion + " - " + resCFDIRelacionados + "\n";

            //Se colocan todos los UUID Relacionados
            for(let i=0; i<cfdiRelacionadosGeneral.elements.length; i++)
            {
                cfdiRelacionadosUUIDs = cfdiRelacionadosUUIDs + "\n" + cfdiRelacionadosGeneral.elements[i].attributes.UUID;
            }
        }

        if(attributes.TipoDeComprobante === "I")
        {
            tipoComprobante = {
                table: {
                    widths: [90,"*",90,90,90],
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
                            {border: [true, false, true, true], text:[
                                {text: cfdiRelacionadosLabel, style: 'textotablaEmisorReceptor', alignment: "center"},
                                {text: cfdiRelacionadosUUIDs, style: 'textotabla', alignment: "center"}
                            ]},  
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


            condiciones = 
                {
                    table: {
                        widths: ["*",80,90,90,101],
                        body: [
                            [
                                {border: [true, false, true, false], text: `Condiciones`, style: 'textotablaEmisorReceptor', alignment: "center"},
                                {border: [true, false, true, false], text: `Periodicidad Mes / Año`, style: 'textotablaEmisorReceptor', alignment: "center"},
                                {border: [true, false, true, false], text: `Orden de Venta`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                                {border: [true, false, true, false], text: `Fecha Vencimiento`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                                {border: [true, false, true, false], text: `Orden de Compra`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                            ],
                            [
                                {border: [true, false, true, true], text: attributes.CondicionesDePago, style: 'textotablaEmisorReceptor', alignment: "center"},
                                {border: [true, false, true, true], text: periodicidadCadena, style: 'textotablaEmisorReceptor', alignment: "center"},
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

            vendedor = 
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
                if(conceptos.elements[i].elements !== undefined)
                {
                    
                    var impuestos = conceptos.elements[i].elements.find( o => o.name === "cfdi:Impuestos")
                    var traslados = impuestos.elements.find( o => o.name === "cfdi:Traslados")
                    var informacionAduanera = conceptos.elements[i].elements.find( o => o.name === "cfdi:InformacionAduanera")
                    var noPedimento = ""
                    if(informacionAduanera !== undefined)
                    {
                        noPedimento = "Pedimento: " + informacionAduanera.attributes.NumeroPedimento + "\n";
                    }

                    var objetoImpuesto = "";
                    if(conceptos.elements[i].attributes.ObjetoImp !== undefined)
                    {
                        objetoImpuesto = "Objeto Imp.: " + conceptos.elements[i].attributes.ObjetoImp;
                    }

                    if(i !== conceptos.elements.length-1)
                    {
                        concepts[psItems] = [
                            {border: [true, false, false, false], text: conceptos.elements[i].attributes.NoIdentificacion + "\n" + arrayRefCruzadas[i], style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.ClaveProdServ, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.Descripcion + "\n" + noPedimento + objetoImpuesto, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.Unidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.ClaveUnidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.Cantidad, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, false], text: arrayLotes[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: arrayPiezas[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: "$" + parseFloat(conceptos.elements[i].attributes.ValorUnitario).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: "$" + parseFloat(traslados.elements[0].attributes.Base).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: traslados.elements[0].attributes.Impuesto, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, false], text: traslados.elements[0].attributes.TipoFactor, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: traslados.elements[0].attributes.TasaOCuota, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, true, false], text: "$" + parseFloat(conceptos.elements[i].attributes.Importe).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                        ]
                
                        psItems++
                    }
                    else {
                        concepts[psItems] = [
                            {border: [true, false, false, true], text: conceptos.elements[i].attributes.NoIdentificacion + "\n" + arrayRefCruzadas[i], style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.ClaveProdServ, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.Descripcion + "\n" + noPedimento +  objetoImpuesto, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.Unidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.ClaveUnidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.Cantidad, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, true], text: arrayLotes[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: arrayPiezas[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: "$" + parseFloat(conceptos.elements[i].attributes.ValorUnitario).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: "$" + parseFloat(traslados.elements[0].attributes.Base).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: traslados.elements[0].attributes.Impuesto, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, true], text: traslados.elements[0].attributes.TipoFactor, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: traslados.elements[0].attributes.TasaOCuota, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, true, true], text: "$" + parseFloat(conceptos.elements[i].attributes.Importe).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                        ]
                
                        psItems++
                    }
                }
                else {
                    if(i !== conceptos.elements.length-1)
                    {
                        concepts[psItems] = [
                            {border: [true, false, false, false], text: conceptos.elements[i].attributes.NoIdentificacion + "\n" + arrayRefCruzadas[i], style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.ClaveProdServ, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.Descripcion + "\n" + objetoImpuesto, style: 'textotabla', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.Unidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.ClaveUnidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.Cantidad, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, false], text: arrayLotes[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: arrayPiezas[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: "$" + parseFloat(conceptos.elements[i].attributes.ValorUnitario).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: "", style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: "", style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, false], text: "", style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: "", style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, true, false], text: "$" + parseFloat(conceptos.elements[i].attributes.Importe).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                        ]
                
                        psItems++
                    }
                    else {
                        concepts[psItems] = [
                            {border: [true, false, false, true], text: conceptos.elements[i].attributes.NoIdentificacion + "\n" + arrayRefCruzadas[i], style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.ClaveProdServ, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.Descripcion + "\n" + objetoImpuesto, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.Unidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.ClaveUnidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.Cantidad, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, true], text: arrayLotes[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: arrayPiezas[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: "$" + parseFloat(conceptos.elements[i].attributes.ValorUnitario).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: "", style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: "", style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, true], text: "", style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: "", style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, true, true], text: "$" + parseFloat(conceptos.elements[i].attributes.Importe).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                        ]
                
                        psItems++
                    }
                }
            }

            if(paramsEncabezado[35] !== undefined && paramsEncabezado[35] !== '|' && paramsEncabezado[35] !== '')
            {
                concepts[psItems] = [
                    {border: [true, true, true, true], text: paramsEncabezado[35], style: 'textotabla', alignment: "center", colSpan: 14},
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""},
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""},
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, true, true], text: ""}, 
                ]
        
                psItems++
            }

            conceptosTable = 
            [
                {
                    table: {
                        dontBreakRows: true, 
                        headerRows: 1,
                        widths: [30,24,"*",23,23,23,23,23,39,39,28,20,25,39],
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
                },
                {text: "\n"}
            ]

            logger.info('Obteniendo la información del Complemento de Comercio Exterior');
            var comercioExterior = complemento.elements.find( o => o.name === "cce11:ComercioExterior")

            if(comercioExterior !== undefined)
            {
                var comercioE = []
                psItems = 0;

                comercioE[psItems] = [
                    {border: [true, true, true, false], text: "Complemento de Comercio Exterior", style: 'textotablaEmisorReceptor', alignment: "center", colSpan:2},
                    {border: [true, true, true, false], text: ""}, 

                ]
        
                psItems++

                comercioE[psItems] = [
                    {border: [true, false, true, false], text: "", colSpan:2},
                    {border: [true, true, true, false], text: ""}, 

                ]
        
                psItems++

                comercioE[psItems] = [
                    {border: [true, false, false, false], text: "Tipo de Operación: " + comercioExterior.attributes.TipoOperacion, style: 'textotablaEmisorReceptor', alignment: "left"},
                    {border: [false, false, true, false], text: "Incoterm: " + comercioExterior.attributes.Incoterm, style: 'textotablaEmisorReceptor', alignment: "left",}, 

                ]
        
                psItems++

                comercioE[psItems] = [
                    {border: [true, false, false, false], text: "Clave de Pedimento: " + comercioExterior.attributes.ClaveDePedimento, style: 'textotablaEmisorReceptor', alignment: "left"},
                    {border: [false, false, true, false], text: "Subdivisión: " + comercioExterior.attributes.Subdivision, style: 'textotablaEmisorReceptor', alignment: "left",}, 

                ]
        
                psItems++

                comercioE[psItems] = [
                    {border: [true, false, false, false], text: "Certificado Origen: " + comercioExterior.attributes.CertificadoOrigen, style: 'textotablaEmisorReceptor', alignment: "left"},
                    {border: [false, false, true, false], text: "Tipo de Cambio USD: " + "$" + parseFloat(comercioExterior.attributes.TipoCambioUSD).toLocaleString("en"), style: 'textotablaEmisorReceptor', alignment: "left",}, 

                ]
        
                psItems++

                comercioE[psItems] = [
                    {border: [true, false, true, false], text: "", colSpan:2},
                    {border: [true, true, true, false], text: ""}, 

                ]
        
                psItems++

                comercioE[psItems] = [
                    {border: [true, false, true, false], text: "Mercancías", style: 'textotablaEmisorReceptor', alignment: "left", colSpan: 2},
                    {border: [false, false, true, false], text: ""}, 

                ]
        
                psItems++

                //Tabla para las mercancias
                var mercanciasT = []
                psItems = 0;

                mercanciasT[psItems] = [
                    {fillColor: "#e4e4e4", border: [true, false, false, false], text: "No. Identificación", style: 'textotabla', alignment: "center"},
                    {fillColor: "#e4e4e4", border: [false, false, false, false], text: "Fracción Arancelaria", style: 'textotabla', alignment: "center"}, 
                    {fillColor: "#e4e4e4", border: [false, false, false, false], text: "Cantidad Aduana", style: 'textotabla', alignment: "center"}, 
                    {fillColor: "#e4e4e4", border: [false, false, false, false], text: "Unidad Aduana", style: 'textotabla', alignment: "center"}, 
                    {fillColor: "#e4e4e4", border: [false, false, false, false], text: "Valor Unitario Aduana", style: 'textotabla', alignment: "center"}, 
                    {fillColor: "#e4e4e4", border: [false, false, true, false], text: "Valor Dólares", style: 'textotabla', alignment: "center"},
                ]
        
                psItems++

                var mercArray = comercioExterior.elements.find( o => o.name === "cce11:Mercancias")
                //console.log(mercArray)

                for(var i=0; i<mercArray.elements.length; i++)
                {

                    if(i!==mercArray.elements.length-1)
                    {
                        mercanciasT[psItems] = [
                            {border: [true, false, false, false], text: mercArray.elements[i].attributes.NoIdentificacion, style: 'textotabla', alignment: "center"},
                            {border: [false, false, false, false], text: mercArray.elements[i].attributes.FraccionArancelaria, style: 'textotabla', alignment: "center"}, 
                            {border: [false, false, false, false], text: mercArray.elements[i].attributes.CantidadAduana, style: 'textotabla', alignment: "center"}, 
                            {border: [false, false, false, false], text: mercArray.elements[i].attributes.UnidadAduana, style: 'textotabla', alignment: "center"}, 
                            {border: [false, false, false, false], text: mercArray.elements[i].attributes.ValorUnitarioAduana, style: 'textotabla', alignment: "center"}, 
                            {border: [false, false, true, false], text: "$" + parseFloat(mercArray.elements[i].attributes.ValorDolares).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "center"},
                        ]
                
                        psItems++
                        
                        mercanciasT[psItems] = [
                            {border: [true, false, false, false], text: [
                                {text: "Marca: ", style: 'textotablaboldblack', alignment: "left"},
                                {text: mercArray.elements[i].elements[0].attributes.Marca, style: 'textotabla', alignment: "left"}
                            ]},
                            {border: [false, false, false, false], text: [
                                {text: "Modelo: ", style: 'textotablaboldblack', alignment: "left"},
                                {text: mercArray.elements[i].elements[0].attributes.Modelo, style: 'textotabla', alignment: "left"}
                            ], colSpan: 2}, 
                            {border: [false, false, false, false], text: ""},
                            {border: [false, false, false, false], text: [
                                {text: "Submodelo: ", style: 'textotablaboldblack', alignment: "left"},
                                {text: mercArray.elements[i].elements[0].attributes.SubModelo, style: 'textotabla', alignment: "left"}
                            ], colSpan: 2},
                            {border: [false, false, false, false], text: ""},
                            {border: [false, false, true, false], text: [
                                {text: "No. Serie: ", style: 'textotablaboldblack', alignment: "left"},
                                {text: mercArray.elements[i].elements[0].attributes.NumeroSerie, style: 'textotabla', alignment: "left"}
                            ]},
                        ]
                
                        psItems++
                    }
                    else {
                        mercanciasT[psItems] = [
                            {border: [true, false, false, false], text: mercArray.elements[i].attributes.NoIdentificacion, style: 'textotabla', alignment: "center"},
                            {border: [false, false, false, false], text: mercArray.elements[i].attributes.FraccionArancelaria, style: 'textotabla', alignment: "center"}, 
                            {border: [false, false, false, false], text: mercArray.elements[i].attributes.CantidadAduana, style: 'textotabla', alignment: "center"}, 
                            {border: [false, false, false, false], text: mercArray.elements[i].attributes.UnidadAduana, style: 'textotabla', alignment: "center"}, 
                            {border: [false, false, false, false], text: mercArray.elements[i].attributes.ValorUnitarioAduana, style: 'textotabla', alignment: "center"}, 
                            {border: [false, false, true, false], text: "$" + parseFloat(mercArray.elements[i].attributes.ValorDolares).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "center"},
                        ]
                
                        psItems++
                        
                        mercanciasT[psItems] = [
                            {border: [true, false, false, true], text: [
                                {text: "Marca: ", style: 'textotablaboldblack', alignment: "left"},
                                {text: mercArray.elements[i].elements[0].attributes.Marca, style: 'textotabla', alignment: "left"}
                            ]},
                            {border: [false, false, false, true], text: [
                                {text: "Modelo: ", style: 'textotablaboldblack', alignment: "left"},
                                {text: mercArray.elements[i].elements[0].attributes.Modelo, style: 'textotabla', alignment: "left"}
                            ], colSpan: 2}, 
                            {border: [false, false, false, false], text: ""},
                            {border: [false, false, false, true], text: [
                                {text: "Submodelo: ", style: 'textotablaboldblack', alignment: "left"},
                                {text: mercArray.elements[i].elements[0].attributes.SubModelo, style: 'textotabla', alignment: "left"}
                            ], colSpan: 2},
                            {border: [false, false, false, false], text: ""},
                            {border: [false, false, true, true], text: [
                                {text: "No. Serie: ", style: 'textotablaboldblack', alignment: "left"},
                                {text: mercArray.elements[i].elements[0].attributes.NumeroSerie, style: 'textotabla', alignment: "left"}
                            ]},
                        ]
                
                        psItems++
                    }
                }

                comercioExteriorTable = 
                [
                    {
                        table: {
                            dontBreakRows: true, 
                            widths: [250, "*"],
                            body: comercioE
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
                    {
                        table: {
                            dontBreakRows: true, 
                            widths: [80, "*", 80, 80, 80, 80],
                            body: mercanciasT
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
                    {text: "\n"}
                ]                
            }
            
        }
        else if(attributes.TipoDeComprobante === "P")
        {
            tipoComprobante = {
                table: {
                    widths: [160,"*",160],
                    body: [
                        [
                            {border: [true, false, true, false], text: `Tipo de comprobante`, style: 'textotablaEmisorReceptor', alignment: "center"},
                            {border: [true, false, true, false], text: `Tipo de Relación entre CFDI`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                            {border: [true, false, true, false], text: `Clave de Uso de CFDI`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        ],
                        [
                            {border: [true, false, true, true], text: attributes.TipoDeComprobante + " - " +  resTipoComprobante, style: 'textotablaEmisorReceptor', alignment: "center"},
                            {border: [true, false, true, true], text:[
                                {text: cfdiRelacionadosLabel, style: 'textotablaEmisorReceptor', alignment: "center"},
                                {text: cfdiRelacionadosUUIDs, style: 'textotabla', alignment: "center"}
                            ]},  
                            {border: [true, false, true, true], text: receptor.attributes.UsoCFDI + " - " + resUsoCFDI, style: 'textotablaEmisorReceptor', alignment: "center"}, 
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
                {border: [true, true, false, true], text: `Clave Producto`, style: 'textotabla2', alignment: "center"},
                {border: [false, true, false, true], text: `Clave SAT`, style: 'textotabla2', alignment: "center"}, 
                {border: [false, true, false, true], text: `Descripción`, style: 'textotabla2', alignment: "center"}, 
                {border: [false, true, false, true], text: `Unidad (SAT)`, style: 'textotabla2', alignment: "center"},  
                {border: [false, true, false, true], text: `Cantidad`, style: 'textotabla2', alignment: "center"},
                {border: [false, true, false, true], text: `Valor Unitario`, style: 'textotabla2', alignment: "center"}, 
                {border: [false, true, true, true], text: `Importe`, style: 'textotabla2', alignment: "center"},
            ]

            psItems++

            //Iteramos cada uno de los conceptos
            for(var i=0; i<conceptos.elements.length; i++)
            {
                var noPedimento = ""
                if(conceptos.elements[i].elements !== undefined)
                {
                    var informacionAduanera = conceptos.elements[i].elements.find( o => o.name === "cfdi:InformacionAduanera")
                
                    if(informacionAduanera !== undefined)
                    {
                        noPedimento = "Pedimento: " + informacionAduanera.attributes.NumeroPedimento + "\n";
                    }
                }

                var objetoImpuesto = "";
                if(conceptos.elements[i].attributes.ObjetoImp !== undefined)
                {
                    objetoImpuesto = "Objeto Imp.: " + conceptos.elements[i].attributes.ObjetoImp;
                }
                  
                if(i !== conceptos.elements.length-1)
                {
                    concepts[psItems] = [
                        {border: [true, false, false, false], text: "", style: 'textotabla', alignment: "center"},
                        {border: [false, false, false, false], text: conceptos.elements[i].attributes.ClaveProdServ, style: 'textotabla', alignment: "center"}, 
                        {border: [false, false, false, false], text: conceptos.elements[i].attributes.Descripcion + "\n" + noPedimento + objetoImpuesto, style: 'textotabla', alignment: "center"}, 
                        {border: [false, false, false, false], text: conceptos.elements[i].attributes.ClaveUnidad, style: 'textotabla', alignment: "center"},  
                        {border: [false, false, false, false], text: conceptos.elements[i].attributes.Cantidad, style: 'textotabla', alignment: "center"},
                        {border: [false, false, false, false], text: "$" + parseFloat(conceptos.elements[i].attributes.ValorUnitario).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "center"}, 
                        {border: [false, false, true, false], text: "$" + parseFloat(conceptos.elements[i].attributes.Importe).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "center"}, 
                    ]
            
                    psItems++
                }
                else {
                    concepts[psItems] = [
                        {border: [true, false, false, true], text: "", style: 'textotabla', alignment: "center"},
                        {border: [false, false, false, true], text: conceptos.elements[i].attributes.ClaveProdServ, style: 'textotabla', alignment: "center"}, 
                        {border: [false, false, false, true], text: conceptos.elements[i].attributes.Descripcion + "\n" + noPedimento + objetoImpuesto, style: 'textotabla', alignment: "center"}, 
                        {border: [false, false, false, true], text: conceptos.elements[i].attributes.ClaveUnidad, style: 'textotabla', alignment: "center"}, 
                        {border: [false, false, false, true], text: conceptos.elements[i].attributes.Cantidad, style: 'textotabla', alignment: "center"},
                        {border: [false, false, false, true], text: "$" + parseFloat(conceptos.elements[i].attributes.ValorUnitario).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "center"}, 
                        {border: [false, false, true, true], text: "$" + parseFloat(conceptos.elements[i].attributes.Importe).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "center"}, 
                    ]
            
                    psItems++
                }
            }

            if(paramsEncabezado[35] !== undefined && paramsEncabezado[35] !== '|' && paramsEncabezado[35] !== '')
            {
                concepts[psItems] = [
                    {border: [true, true, true, true], text: paramsEncabezado[35], style: 'textotabla', alignment: "center", colSpan: 7},
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""},
                    {border: [false, false, false, true], text: ""}, 
                ]
        
                psItems++
            }

            conceptosTable = 
            [
                {
                    table: {
                        dontBreakRows: true, 
                        headerRows: 1,
                        widths: [60,60,"*",60,60,60,60],
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
                },
                {text: "\n"}   
            ]

            logger.info('Obteniendo la información del Complemento de Pago');
            var pago = complemento.elements.find( o => o.name === "pago20:Pagos");

            logger.info('Obteniendo la información del Complemento de Pago: Totales');
            var pagoTotales = pago.elements.find( o => o.name === "pago20:Totales");
            var montoTotalPagos;
            if(pagoTotales !== undefined)
            {
                //Obtener el monto total pagos
                montoTotalPagos = "$" + parseFloat(pagoTotales.attributes.MontoTotalPagos).toLocaleString(undefined, {minimumFractionDigits: 2});
            }

            var cfdiRelacionados = []
            psItems = 0;

            cfdiRelacionados[psItems] = [
                {border: [true, true, true, true], text: `Complemento de pago versión 2.0`, style: 'textotablaEmisorReceptorBold', alignment: "center", colSpan: 9},
                {border: [true, true, true, false], text: ``}, 
                {border: [true, true, true, false], text: ``}, 
                {border: [true, true, true, false], text: ``}, 
                {border: [true, true, true, false], text: ``}, 
                {border: [true, true, true, false], text: ``}, 
                {border: [true, true, true, false], text: ``}, 
                {border: [true, true, true, false], text: ``}, 
                {border: [true, true, true, false], text: ``}, 
            ]

            psItems++

            //Obtener los datos de los pagos
            for(var j=0; j<pago.elements.length; j++)
            {
                console.log(pago.elements[j]);

                if(pago.elements[j].name === "pago20:Pago")
                {                
                    var pago20 = pago.elements[j];

                    let formaPagoP = "";
                    if(pago20.attributes.FormaDePagoP !== undefined)
                    {
                        var paramsFormaPago2 = {
                            pvOptionCRUD: "R",
                            pvIdCatalog: pago20.attributes.FormaDePagoP,
                            table: "SAT_Cat_Payment_Instruments"
                        }
                
                        var resFormaPago2 = await dbcatcatalogs.getCatalogIdDescription(paramsFormaPago2);
                        formaPagoP = pago20.attributes.FormaDePagoP + " - " + resFormaPago2;
                    }
                    
                    let monedaP = ""
                    if(pago20.attributes.MonedaP !== undefined)
                    {
                        var paramsMoneda2 = {
                            pvOptionCRUD: "R",
                            pvIdCatalog: pago20.attributes.MonedaP,
                            table: "SAT_Cat_Currencies"
                        }
                
                        var resMoneda2 = await dbcatcatalogs.getCatalogIdShortDescription(paramsMoneda2);
                        monedaP = pago20.attributes.MonedaP + " - " + resMoneda2;
                    }
                    
                    var bancoEmisor = ""
                    if(pago20.attributes.NomBancoOrdExt !== undefined)
                    {
                        bancoEmisor = pago20.attributes.NomBancoOrdExt
                    }
                    else if(pago20.attributes.RfcEmisorCtaOrd !== undefined)
                    {
                        var paramsBancoEmisor = {
                            pvOptionCRUD: "R",
                            pvTaxId: pago20.attributes.RfcEmisorCtaOrd,
                            table: "SAT_Cat_Banks"
                        }
                
                        bancoEmisor = await dbcatcatalogs.getNameBank(paramsBancoEmisor);
                    }

                    let bancoBeneficiario = ""
                    if(pago20.attributes.RfcEmisorCtaBen !== undefined)
                    {
                        var paramsBancoBeneficiario = {
                            pvOptionCRUD: "R",
                            pvTaxId: pago20.attributes.RfcEmisorCtaBen,
                            table: "SAT_Cat_Banks"
                        }
                
                        bancoBeneficiario = await dbcatcatalogs.getNameBank(paramsBancoBeneficiario);
                    }
                    
                    cfdiRelacionados[psItems] = [
                        {border: [true, false, true, false], text: ``, colSpan: 9},
                        {border: [true, false, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                    ]

                    psItems++

                    cfdiRelacionados[psItems] = [
                        {border: [true, false, false, false], text: `Fecha de Pago: `  + pago20.attributes.FechaPago, style: 'textotablaEmisorReceptor', alignment: "left", colSpan: 4},
                        {border: [true, true, true, false], text: ``},
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [false, false, true, false], text: `Total del Pago: ` + montoTotalPagos, style: 'textotablaEmisorReceptor', alignment: "left", colSpan: 5}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                    ]

                    psItems++

                    let rfcEmisorCtaOrd = "";
                    if(pago20.attributes.RfcEmisorCtaOrd !== undefined)
                    {
                        rfcEmisorCtaOrd = pago20.attributes.RfcEmisorCtaOrd;
                    }

                    let rfcEmisorCtaBen = "";
                    if(pago20.attributes.RfcEmisorCtaBen !== undefined)
                    {
                        rfcEmisorCtaBen = pago20.attributes.RfcEmisorCtaBen;
                    }

                    cfdiRelacionados[psItems] = [
                        {border: [true, false, false, false], text: `RFC Entidad Emisora: ` + rfcEmisorCtaOrd, style: 'textotablaEmisorReceptor', alignment: "left", colSpan: 4},
                        {border: [false, false, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [false, false, true, false], text: `RFC Entidad Beneficiaria: ` + rfcEmisorCtaBen, style: 'textotablaEmisorReceptor', alignment: "left", colSpan:5}, 
                        {border: [true, true, true, false], text: ``},
                        {border: [true, true, true, false], text: ``},  
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                    ]

                    psItems++

                    cfdiRelacionados[psItems] = [
                        {border: [true, false, false, false], text: `Nombre Entidad Emisora: ` + bancoEmisor, style: 'textotablaEmisorReceptor', alignment: "left", colSpan: 4},
                        {border: [false, false, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [false, false, true, false], text: `Nombre Entidad Beneficiaria: ` + bancoBeneficiario, style: 'textotablaEmisorReceptor', alignment: "left", colSpan:5}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                    ]

                    psItems++

                    let ctaOrdenante = "";
                    if(pago20.attributes.CtaOrdenante !== undefined)
                    {
                        ctaOrdenante = pago20.attributes.CtaOrdenante;
                    }

                    let ctaBeneficiario = "";
                    if(pago20.attributes.CtaBeneficiario !== undefined)
                    {
                        ctaBeneficiario = pago20.attributes.CtaBeneficiario;
                    }

                    cfdiRelacionados[psItems] = [
                        {border: [true, false, false, false], text: `Cuenta Origen: ` + ctaOrdenante, style: 'textotablaEmisorReceptor', alignment: "left", colSpan:4},
                        {border: [false, false, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [false, false, true, false], text: `Cuenta Destino: ` + ctaBeneficiario, style: 'textotablaEmisorReceptor', alignment: "left", colSpan:5}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                    ]

                    psItems++
                    
                    var tipoCambio = "";
                    if(pago20.attributes.TipoCambioP !== undefined)
                    {
                        tipoCambio = pago20.attributes.TipoCambioP;
                    }

                    cfdiRelacionados[psItems] = [
                        {border: [true, false, false, false], text: `Tipo de Cambio: ` + tipoCambio, style: 'textotablaEmisorReceptor', alignment: "left", colSpan: 4},
                        {border: [false, false, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [false, false, true, false], text: `Moneda: ` + pago20.attributes.MonedaP + " - " + resMoneda2, style: 'textotablaEmisorReceptor', alignment: "left", colSpan: 5}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                    ]

                    psItems++

                    cfdiRelacionados[psItems] = [
                        {border: [true, false, true, false], text: `Forma de Pago: ` + pago20.attributes.FormaDePagoP + " - " + resFormaPago2, style: 'textotablaEmisorReceptor', alignment: "left", colSpan: 9},
                        {border: [false, false, true, false], text: ``, style: 'textotablaEmisorReceptor', alignment: "left"}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``},
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                    ]

                    psItems++
                    

                    /*pagosTable = 
                    {
                        table: {
                            dontBreakRows: true, 
                            widths: ["*", 262],
                            body: pagos
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
                    }*/

                    cfdiRelacionados[psItems] = [
                        {border: [true, true, true, false], text: `CFDI Relacionados`, style: 'textotablaEmisorReceptor', alignment: "center", colSpan: 9},
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                    ]

                    psItems++

                    cfdiRelacionados[psItems] = [
                        {border: [true, false, true, false], text: "", colSpan: 9},
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                        {border: [true, true, true, false], text: ``}, 
                    ]

                    psItems++

                    cfdiRelacionados[psItems] = [
                        {fillColor: "#e4e4e4", border: [true, false, false, false], text: `UUID`, style: 'textotabla', alignment: "center"},
                        {fillColor: "#e4e4e4", border: [false, false, false, false], text: `No. de parcialidad`, style: 'textotabla', alignment: "center"}, 
                        {fillColor: "#e4e4e4", border: [false, false, false, false], text: `Folio`, style: 'textotabla', alignment: "center"}, 
                        {fillColor: "#e4e4e4", border: [false, false, false, false], text: `Objeto Imp. DR`, style: 'textotabla', alignment: "center"}, 
                        {fillColor: "#e4e4e4", border: [false, false, false, false], text: `Equivalencia DR`, style: 'textotabla', alignment: "center"}, 
                        {fillColor: "#e4e4e4", border: [false, false, false, false], text: `Impuesto Retenciones DR`, style: 'textotabla', alignment: "center"}, 
                        {fillColor: "#e4e4e4", border: [false, false, false, false], text: `Importe del saldo insoluto`, style: 'textotabla', alignment: "center"}, 
                        {fillColor: "#e4e4e4", border: [false, false, false, false], text: `Saldo pendiente`, style: 'textotabla', alignment: "center"}, 
                        {fillColor: "#e4e4e4", border: [false, false, true, false], text: `Importe pagado`, style: 'textotabla', alignment: "center"}, 
                    ]

                    psItems++

                    //console.log(pago.elements[0].elements)
                    var pago20;
                    if(pago.elements[0].name === "pago20:Pago")
                    {
                        pago20 = pago.elements[0]
                    }
                    else {
                        pago20 = pago.elements[1]
                    }

                    for(var i=0; i<pago20.elements.length; i++)
                    {
                        var impuestoRetencionesDR = 0
                        if(pago20.elements[i].name === "pago20:DoctoRelacionado")
                        {
                            //console.log(pago20.elements[i].elements)
                            if(pago20.elements[i].elements !== undefined)
                            {
                                var impuestosDR = pago20.elements[i].elements.find( o => o.name === "pago20:ImpuestosDR")
                                var retencionesDR = impuestosDR.elements.find( o => o.name === "pago20:RetencionesDR")
                                if(retencionesDR !== undefined)
                                {
                                    //Se realiza la suma de todas las retencionesDR+
                                    for(var j=0; j<retencionesDR.elements.length; j++)
                                    {
                                        impuestoRetencionesDR = impuestoRetencionesDR + parseInt(retencionesDR.elements[j].attributes.ImporteDR,10).toLocaleString(undefined, {minimumFractionDigits: 2});
                                    }
                                }
                            }
                        }

                        if(pago20.elements[i].name === "pago20:DoctoRelacionado")
                        {
                            cfdiRelacionados[psItems] = [
                                {border: [true, false, false, false], text: pago20.elements[i].attributes.IdDocumento, style: 'textotabla3', alignment: "left"},
                                {border: [false, false, false, false], text: pago20.elements[i].attributes.NumParcialidad, style: 'textotabla', alignment: "center"}, 
                                {border: [false, false, false, false], text: pago20.elements[i].attributes.Folio, style: 'textotabla', alignment: "center"}, 
                                {border: [false, false, false, false], text: pago20.elements[i].attributes.ObjetoImpDR, style: 'textotabla', alignment: "center"}, 
                                {border: [false, false, false, false], text: pago20.elements[i].attributes.EquivalenciaDR, style: 'textotabla', alignment: "center"}, 
                                {border: [false, false, false, false], text: "$" + parseFloat(impuestoRetencionesDR).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "center"}, 
                                {border: [false, false, false, false], text: "$" + parseFloat(pago20.elements[i].attributes.ImpSaldoInsoluto).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "center"}, 
                                {border: [false, false, false, false], text: "$" + parseFloat(pago20.elements[i].attributes.ImpSaldoAnt).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "center"}, 
                                {border: [false, false, true, false], text: "$" + parseFloat(pago20.elements[i].attributes.ImpPagado).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "center"}, 
                            ]
                
                            psItems++
                        }
                    }

                    cfdiRelacionados[psItems] = [
                        {border: [true, false, true, true], text: "", style: 'textotabla4', colSpan: 9},
                        {border: [false, false, false, false], text: ""}, 
                        {border: [false, false, false, false], text: ""}, 
                        {border: [false, false, false, false], text: ""}, 
                        {border: [false, false, false, false], text: ""}, 
                        {border: [false, false, false, false], text: ""}, 
                        {border: [false, false, false, false], text: ""}, 
                        {border: [false, false, false, false], text: ""}, 
                        {border: [false, false, true, false], text: ""}, 
                    ]

                    psItems++

                    var impuestosP = pago20.elements.find( o => o.name === "pago20:ImpuestosP");
                    if(impuestosP !== undefined)
                    {
                        var retencionesP = impuestosP.elements.find( o => o.name === "pago20:RetencionesP")
                        if(retencionesP !== undefined)
                        {
                            var impuestoRetencionesP = 0;
                            //Se realiza la suma de todas las retencionesP+
                            for(var j=0; j<retencionesP.elements.length; j++)
                            {
                                //console.log(retencionesP.elements[j].attributes.ImporteP)
                                impuestoRetencionesP = impuestoRetencionesP + parseInt(retencionesP.elements[j].attributes.ImporteP,10);
                            }

                            cfdiRelacionados[psItems] = [
                                {border: [true, false, false, false], text: ""},
                                {border: [false, false, false, false], text: ""}, 
                                {border: [false, false, false, false], text: ""}, 
                                {border: [false, false, false, false], text: ""}, 
                                {border: [false, false, false, false], text: ""}, 
                                {border: [false, false, true, false], text: [
                                    {text: "Impuesto Retenciones del Pago: ", style: 'textotablaboldblack'},
                                    {text: "$" + parseFloat(impuestoRetencionesP).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "center"}
                                ], colSpan: 4}, 
                                {border: [false, false, false, false], text: ""}, 
                                {border: [false, false, false, false], text: ""}, 
                                {border: [false, false, true, false], text: ""}, 
                            ]
                
                            psItems++
                            
                        }
                    }
                }
            }

            var retIva = 0
            if(pagoTotales.attributes.TotalRetencionesIVA !== undefined)
            {
                retIva = pagoTotales.attributes.TotalRetencionesIVA;

                cfdiRelacionados[psItems] = [
                    {border: [false, true, false, false], text: "", style: 'textotabla', alignment: "left"},
                    {border: [false, true, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, true, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, true, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, true, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [true, true, true, false],  text: "Total retenciones IVA", style: 'textotabla', alignment: "left", colSpan:2},
                    {border: [false, true, false, false],  text: ""}, 
                    {border: [true, true, true, false],  text: "$" + parseFloat(retIva).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "left", colSpan:2}, 
                    {border: [false, true, true, false],  text: ""}, 
                ]
    
                psItems++
            }

            var retIsr = 0
            if(pagoTotales.attributes.TotalRetencionesISR !== undefined)
            {
                retIsr = pagoTotales.attributes.TotalRetencionesISR;

                cfdiRelacionados[psItems] = [
                    {border: [false, false, false, false], text: "", style: 'textotabla', alignment: "left"},
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [true, false, true, false],  text: "Total Retenciones ISR", style: 'textotabla', alignment: "left", colSpan:2},
                    {border: [false, false, false, false],  text: ""}, 
                    {border: [true, false, true, false],  text: "$" + parseFloat(retIsr).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "left", colSpan:2}, 
                    {border: [false, false, true, false],  text: ""}, 
                ]
    
                psItems++
            }

            var retIeps = 0
            if(pagoTotales.attributes.TotalRetencionesIEPS !== undefined)
            {
                retIeps = pagoTotales.attributes.TotalRetencionesIEPS;

                cfdiRelacionados[psItems] = [
                    {border: [false, false, false, false], text: "", style: 'textotabla', alignment: "left"},
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [true, false, true, false],  text: "Total Retenciones IEPS", style: 'textotabla', alignment: "left", colSpan:2},
                    {border: [false, false, false, false],  text: ""}, 
                    {border: [true, false, true, false],  text: "$" + parseFloat(retIeps).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "left", colSpan:2}, 
                    {border: [false, false, true, false],  text: ""}, 
                ]
    
                psItems++
            }

            var trasIB16 = 0
            if(pagoTotales.attributes.TotalTrasladosBaseIVA16 !== undefined)
            {
                trasIB16 = pagoTotales.attributes.TotalTrasladosBaseIVA16;

                cfdiRelacionados[psItems] = [
                    {border: [false, false, false, false], text: "", style: 'textotabla', alignment: "left"},
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [true, false, true, false],  text: "Total Traslado Base IVA 16 ", style: 'textotabla', alignment: "left", colSpan:2},
                    {border: [false, false, false, false],  text: ""}, 
                    {border: [true, false, true, false],  text: "$" + parseFloat(trasIB16).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "left", colSpan:2}, 
                    {border: [false, false, true, false],  text: ""}, 
                ]
    
                psItems++
            }

            var trasI16 = 0
            if(pagoTotales.attributes.TotalTrasladosImpuestoIVA16 !== undefined)
            {
                trasI16 = pagoTotales.attributes.TotalTrasladosImpuestoIVA16;

                cfdiRelacionados[psItems] = [
                    {border: [false, false, false, false], text: "", style: 'textotabla', alignment: "left"},
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [true, false, true, false],  text: "Total Traslados Impuesto IVA 16", style: 'textotabla', alignment: "left", colSpan:2},
                    {border: [false, false, false, false],  text: ""}, 
                    {border: [true, false, true, false],  text: "$" + parseFloat(trasI16).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "left", colSpan:2}, 
                    {border: [false, false, true, false],  text: ""}, 
                ]
    
                psItems++
            }

            var trasIB8 = 0
            if(pagoTotales.attributes.TotalTrasladosBaseIVA8 !== undefined)
            {
                trasIB8 = pagoTotales.attributes.TotalTrasladosBaseIVA8;

                cfdiRelacionados[psItems] = [
                    {border: [false, false, false, false], text: "", style: 'textotabla', alignment: "left"},
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [true, false, true, false],  text: "Total Traslados Base IVA 8", style: 'textotabla', alignment: "left", colSpan:2},
                    {border: [false, false, false, false],  text: ""}, 
                    {border: [true, false, true, false],  text: "$" + parseFloat(trasIB8).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "left", colSpan:2}, 
                    {border: [false, false, true, false],  text: ""}, 
                ]
    
                psItems++
            }

            var trasII8 = 0
            if(pagoTotales.attributes.TotalTrasladosImpuestoIVA8 !== undefined)
            {
                trasII8 = pagoTotales.attributes.TotalTrasladosImpuestoIVA8;

                cfdiRelacionados[psItems] = [
                    {border: [false, false, false, false], text: "", style: 'textotabla', alignment: "left"},
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [true, false, true, false],  text: "Total Traslados Impuestos IVA 8", style: 'textotabla', alignment: "left", colSpan:2},
                    {border: [false, false, false, false],  text: ""}, 
                    {border: [true, false, true, false],  text: "$" + parseFloat(trasII8).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "left", colSpan:2}, 
                    {border: [false, false, true, false],  text: ""}, 
                ]
    
                psItems++
            }

            var trasBI0 = 0
            if(pagoTotales.attributes.TotalTrasladosBaseIVA0 !== undefined)
            {
                trasBI0 = pagoTotales.attributes.TotalTrasladosBaseIVA0;

                cfdiRelacionados[psItems] = [
                    {border: [false, false, false, false], text: "", style: 'textotabla', alignment: "left"},
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [true, false, true, false],  text: "Total Traslados Base IVA 0", style: 'textotabla', alignment: "left", colSpan:2},
                    {border: [false, false, false, false],  text: ""}, 
                    {border: [true, false, true, false],  text: "$" + parseFloat(trasBI0).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "left", colSpan:2}, 
                    {border: [false, false, true, false],  text: ""}, 
                ]
    
                psItems++
            }

            var trasII0 = 0
            if(pagoTotales.attributes.TotalTrasladosImpuestoIVA0 !== undefined)
            {
                trasII0 = pagoTotales.attributes.TotalTrasladosImpuestoIVA0;

                cfdiRelacionados[psItems] = [
                    {border: [false, false, false, false], text: "", style: 'textotabla', alignment: "left"},
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [true, false, true, false],  text: "Total Traslado Impuesto IVA 0", style: 'textotabla', alignment: "left", colSpan:2},
                    {border: [false, false, false, false],  text: ""}, 
                    {border: [true, false, true, false],  text: "$" + parseFloat(trasII0).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "left", colSpan:2}, 
                    {border: [false, false, true, false],  text: ""}, 
                ]
    
                psItems++
            }

            var trasBI6 = 0
            if(pagoTotales.attributes.TotalTrasladosBaseIVAExento !== undefined)
            {
                trasBI6 = pagoTotales.attributes.TotalTrasladosBaseIVAExento;

                cfdiRelacionados[psItems] = [
                    {border: [false, false, false, false], text: "", style: 'textotabla', alignment: "left"},
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                    {border: [true, false, true, false],  text: "Total Trasladados Base IVA Excento", style: 'textotabla', alignment: "left", colSpan:2},
                    {border: [false, false, false, false],  text: ""}, 
                    {border: [true, false, true, false],  text: "$" + parseFloat(trasBI6).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "left", colSpan:2}, 
                    {border: [false, false, true, false],  text: ""}, 
                ]
    
                psItems++
            }

            var montoTP = 0
            if(pagoTotales.attributes.MontoTotalPagos !== undefined)
            {
                montoTP = pagoTotales.attributes.MontoTotalPagos;
            }

            cfdiRelacionados[psItems] = [
                {border: [false, false, false, false], text: "", style: 'textotabla', alignment: "left"},
                {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                {border: [false, false, false, false],  text: "", style: 'textotabla', alignment: "center"}, 
                {border: [true, false, true, true],  text: "Monto Total Pagos", style: 'textotabla', alignment: "left", colSpan:2},
                {border: [false, false, false, false],  text: ""}, 
                {border: [true, false, true, true],  text: "$" + parseFloat(montoTP).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla', alignment: "left", colSpan:2}, 
                {border: [false, false, true, false],  text: ""}, 
            ]

            psItems++

            cfdiRelTable = 
            [
                {
                    table: {
                        dontBreakRows: true, 
                        widths: ["*", 45, 45, 45, 45, 45, 45, 45, 45],
                        body: cfdiRelacionados
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
                {text: "\n"}
            ]
        }
        else if(attributes.TipoDeComprobante === "T")
        {
            tipoComprobante = {
                table: {
                    widths: [160,"*",160],
                    body: [
                        [
                            {border: [true, false, true, false], text: `Tipo de comprobante`, style: 'textotablaEmisorReceptor', alignment: "center"},
                            {border: [true, false, true, false], text: `Tipo de Relación entre CFDI`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                            {border: [true, false, true, false], text: `Clave de Uso de CFDI`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        ],
                        [
                            {border: [true, false, true, true], text: attributes.TipoDeComprobante + " - " +  resTipoComprobante, style: 'textotablaEmisorReceptor', alignment: "center"},
                            {border: [true, false, true, true], text:[
                                {text: cfdiRelacionadosLabel, style: 'textotablaEmisorReceptor', alignment: "center"},
                                {text: cfdiRelacionadosUUIDs, style: 'textotabla', alignment: "center"}
                            ]}, 
                            {border: [true, false, true, true], text: receptor.attributes.UsoCFDI + " - " + resUsoCFDI, style: 'textotablaEmisorReceptor', alignment: "center"}, 
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

            condiciones = 
            {
                table: {
                    widths: ["*",80,90,90,101],
                    body: [
                        [
                            {border: [true, false, true, false], text: `Condiciones`, style: 'textotablaEmisorReceptor', alignment: "center"},
                            {border: [true, false, true, false], text: `Periodicidad Mes / Año`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                            {border: [true, false, true, false], text: `Orden de Venta`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                            {border: [true, false, true, false], text: `Fecha Vencimiento`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                            {border: [true, false, true, false], text: `Orden de Compra`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        ],
                        [
                            {border: [true, false, true, true], text: attributes.CondicionesDePago, style: 'textotablaEmisorReceptor', alignment: "center"},
                            {border: [true, false, true, true], text: periodicidadCadena, style: 'textotablaEmisorReceptor', alignment: "center"},
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

            vendedor = 
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
                if(conceptos.elements[i].elements !== undefined)
                {
                    var impuestos = conceptos.elements[i].elements.find( o => o.name === "cfdi:Impuestos")
                    var traslados = impuestos.elements.find( o => o.name === "cfdi:Traslados")
                    var informacionAduanera = conceptos.elements[i].elements.find( o => o.name === "cfdi:InformacionAduanera")

                    var noPedimento = ""
                    if(informacionAduanera !== undefined)
                    {
                        noPedimento = "Pedimento: " + informacionAduanera.attributes.NumeroPedimento + "\n";
                    }

                    var objetoImpuesto = "";
                    if(conceptos.elements[i].attributes.ObjetoImp !== undefined)
                    {
                        objetoImpuesto = "Objeto Imp.: " + conceptos.elements[i].attributes.ObjetoImp;
                    }

                    if(i !== conceptos.elements.length-1)
                    {
                        concepts[psItems] = [
                            {border: [true, false, false, false], text: conceptos.elements[i].attributes.NoIdentificacion, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.ClaveProdServ, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.Descripcion + "\n" + noPedimento +  objetoImpuesto, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.Unidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.ClaveUnidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.Cantidad, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, false], text: arrayLotes[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: arrayPiezas[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: "$" + parseFloat(conceptos.elements[i].attributes.ValorUnitario).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: "$" + parseFloat(traslados.elements[0].attributes.Base).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: traslados.elements[0].attributes.Impuesto, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, false], text: traslados.elements[0].attributes.TipoFactor, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: traslados.elements[0].attributes.TasaOCuota, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, true, false], text: "$" + parseFloat(conceptos.elements[i].attributes.Importe).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                        ]
                
                        psItems++
                    }
                    else {
                        concepts[psItems] = [
                            {border: [true, false, false, true], text: conceptos.elements[i].attributes.NoIdentificacion, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.ClaveProdServ, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.Descripcion + "\n" + noPedimento + objetoImpuesto, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.Unidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.ClaveUnidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.Cantidad, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, true], text: arrayLotes[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: arrayPiezas[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: "$" + parseFloat(conceptos.elements[i].attributes.ValorUnitario).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: "$" + parseFloat(traslados.elements[0].attributes.Base).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: traslados.elements[0].attributes.Impuesto, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, true], text: traslados.elements[0].attributes.TipoFactor, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: traslados.elements[0].attributes.TasaOCuota, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, true, true], text: "$" + parseFloat(conceptos.elements[i].attributes.Importe).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                        ]
                
                        psItems++
                    }
                }
                else {
                    if(i !== conceptos.elements.length-1)
                    {
                        console.log(conceptos.elements[i].attributes)
                        concepts[psItems] = [
                            {border: [true, false, false, false], text: conceptos.elements[i].attributes.NoIdentificacion, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.ClaveProdServ, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.Descripcion + "\n" + objetoImpuesto, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.Unidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.ClaveUnidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.Cantidad, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, false], text: arrayLotes[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: arrayPiezas[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: "$" + parseFloat(conceptos.elements[i].attributes.ValorUnitario).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: "", style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: "", style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, false], text: "", style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: "", style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, true, false], text: "$" + parseFloat(conceptos.elements[i].attributes.Importe).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                        ]
                
                        psItems++
                    }
                    else {
                        concepts[psItems] = [
                            {border: [true, false, false, true], text: conceptos.elements[i].attributes.NoIdentificacion, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.ClaveProdServ, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.Descripcion + "\n" + objetoImpuesto, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.Unidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.ClaveUnidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.Cantidad, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, true], text: arrayLotes[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: arrayPiezas[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: "$" + parseFloat(conceptos.elements[i].attributes.ValorUnitario).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: "", style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: "", style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, true], text: "", style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: "", style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, true, true], text: "$" + parseFloat(conceptos.elements[i].attributes.Importe).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                        ]
                
                        psItems++
                    }
                }
            }

            if(paramsEncabezado[35] !== undefined && paramsEncabezado[35] !== '|' && paramsEncabezado[35] !== '')
            {
                concepts[psItems] = [
                    {border: [true, true, true, true], text: paramsEncabezado[35], style: 'textotabla', alignment: "center", colSpan: 14},
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""},
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""},
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, true, true], text: ""}, 
                ]
        
                psItems++
            }

            conceptosTable = 
            [
                {
                    table: {
                        dontBreakRows: true, 
                        headerRows: 1,
                        widths: [30,24,"*",23,23,23,23,23,39,39,28,20,25,39],
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
                },
                {text: "\n"}
            ]
        }
        else if(attributes.TipoDeComprobante === "E")
        {
            tipoComprobante = {
                table: {
                    widths: [90,"*",90,90,90],
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
                            {border: [true, false, true, true], text:[
                                {text: cfdiRelacionadosLabel, style: 'textotablaEmisorReceptor', alignment: "center"},
                                {text: cfdiRelacionadosUUIDs, style: 'textotabla', alignment: "center"}
                            ]}, 
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

            vendedor = 
            {
                table: {
                    widths: [160,"*",160],
                    body: [
                        [
                            {border: [true, false, true, false], text: `Vendedor`, style: 'textotablaEmisorReceptor', alignment: "center"},
                            {border: [true, false, true, false], text: `Orden de Venta`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                            {border: [true, false, true, false], text: `Orden de Compra`, style: 'textotablaEmisorReceptor', alignment: "center"}, 
                        ],
                        [
                            {border: [true, false, true, true], text: paramsEncabezado[31], style: 'textotablaEmisorReceptor', alignment: "center"},
                            {border: [true, false, true, true], text: paramsEncabezado[28], style: 'textotablaEmisorReceptor', alignment: "center"}, 
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
                if(conceptos.elements[i].elements !== undefined)
                {
                    var impuestos = conceptos.elements[i].elements.find( o => o.name === "cfdi:Impuestos")
                    var traslados = impuestos.elements.find( o => o.name === "cfdi:Traslados")
                    var informacionAduanera = conceptos.elements[i].elements.find( o => o.name === "cfdi:InformacionAduanera")
                    
                    var noPedimento = ""
                    if(informacionAduanera !== undefined)
                    {
                        noPedimento = "Pedimento: " + informacionAduanera.attributes.NumeroPedimento + "\n";
                    }

                    var objetoImpuesto = "";
                    if(conceptos.elements[i].attributes.ObjetoImp !== undefined)
                    {
                        objetoImpuesto = "Objeto Imp.: " + conceptos.elements[i].attributes.ObjetoImp;
                    }

                    if(i !== conceptos.elements.length-1)
                    {
                        concepts[psItems] = [
                            {border: [true, false, false, false], text: conceptos.elements[i].attributes.NoIdentificacion, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.ClaveProdServ, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.Descripcion + "\n" + noPedimento + objetoImpuesto, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.Unidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.ClaveUnidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.Cantidad, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, false], text: arrayLotes[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: arrayPiezas[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: "$" + parseFloat(conceptos.elements[i].attributes.ValorUnitario).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: "$" + parseFloat(traslados.elements[0].attributes.Base).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: traslados.elements[0].attributes.Impuesto, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, false], text: traslados.elements[0].attributes.TipoFactor, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: traslados.elements[0].attributes.TasaOCuota, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, true, false], text: "$" + parseFloat(conceptos.elements[i].attributes.Importe).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                        ]
                
                        psItems++
                    }
                    else {

                        concepts[psItems] = [
                            {border: [true, false, false, true], text: conceptos.elements[i].attributes.NoIdentificacion, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.ClaveProdServ, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.Descripcion + "\n" + noPedimento + objetoImpuesto, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.Unidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.ClaveUnidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.Cantidad, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, true], text: arrayLotes[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: arrayPiezas[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: "$" + parseFloat(conceptos.elements[i].attributes.ValorUnitario).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: "$" + parseFloat(traslados.elements[0].attributes.Base).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: traslados.elements[0].attributes.Impuesto, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, true], text: traslados.elements[0].attributes.TipoFactor, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: traslados.elements[0].attributes.TasaOCuota, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, true, true], text: "$" + parseFloat(conceptos.elements[i].attributes.Importe).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                        ]
                
                        psItems++
                    }
                }
                else {
                   
                    if(i !== conceptos.elements.length-1)
                    {
                        console.log(conceptos.elements[i].attributes)
                        concepts[psItems] = [
                            {border: [true, false, false, false], text: conceptos.elements[i].attributes.NoIdentificacion, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.ClaveProdServ, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.Descripcion + "\n" + objetoImpuesto, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.Unidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.ClaveUnidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: conceptos.elements[i].attributes.Cantidad, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, false], text: arrayLotes[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: arrayPiezas[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: "$" + parseFloat(conceptos.elements[i].attributes.ValorUnitario).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: "", style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: "", style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, false], text: "", style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, false], text: "", style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, true, false], text: "$" + parseFloat(conceptos.elements[i].attributes.Importe).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                        ]
                
                        psItems++
                    }
                    else {
                        concepts[psItems] = [
                            {border: [true, false, false, true], text: conceptos.elements[i].attributes.NoIdentificacion, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.ClaveProdServ, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.Descripcion + "\n" + objetoImpuesto, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.Unidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.ClaveUnidad, style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: conceptos.elements[i].attributes.Cantidad, style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, true], text: arrayLotes[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: arrayPiezas[i], style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: "$" + parseFloat( conceptos.elements[i].attributes.ValorUnitario).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: "", style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: "", style: 'textotabla3', alignment: "center"},
                            {border: [false, false, false, true], text: "", style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, false, true], text: "", style: 'textotabla3', alignment: "center"}, 
                            {border: [false, false, true, true], text: "$" + parseFloat(conceptos.elements[i].attributes.Importe).toLocaleString(undefined, {minimumFractionDigits: 2}), style: 'textotabla3', alignment: "center"}, 
                        ]
                
                        psItems++
                    }
                }
            }

            if(paramsEncabezado[35] !== undefined && paramsEncabezado[35] !== '|' && paramsEncabezado[35] !== '')
            {
                concepts[psItems] = [
                    {border: [true, true, true, true], text: paramsEncabezado[35], style: 'textotabla', alignment: "center", colSpan: 14},
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""},
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""},
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, false, true], text: ""}, 
                    {border: [false, false, true, true], text: ""}, 
                ]
        
                psItems++
            }

            conceptosTable = 
            [
                {
                    table: {
                        dontBreakRows: true, 
                        headerRows: 1,
                        widths: [30,24,"*",23,23,23,23,23,39,39,28,20,25,39],
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
                },
                {text: "\n"}
            ]
        }

        var leyendasF = {}
        var norma = {}

        logger.info('Obteniendo la información de las Leyendas Fiscales'); 
        var leyendaFiscal = complemento.elements.find( o => o.name === "leyendasFisc:LeyendasFiscales")
        if(leyendaFiscal !== undefined)
        {
            leyendasF = [
                {
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
                },
                {text: "\n"}
            ]

            norma = [
                {
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
                },
                {text: "\n"}
            ]
        }

        logger.info('Obteniendo la información del Timbre Fiscal Digital');
        var timbreFiscal = complemento.elements.find( o => o.name === "tfd:TimbreFiscalDigital");

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
                dontBreakRows: true,
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

        logger.info('Generando Código QR'); 
        var imageQR = timbreFiscal.attributes.UUID + ".png"
        //console.log(imageQR)

        const buffer = await new AwesomeQR({
            text: url,
            size: 500,
        }).draw();

        var temporalFilesPath = (resTemporalFiles[0])[0].Value
        //console.log(temporalFilesPath)
        
        logger.info('Guardando Imagen de Código QR'); 
        fs.writeFileSync(temporalFilesPath + imageQR, buffer);

        var paramsMoneda = {
            pvOptionCRUD: "R",
            pvIdCatalog: attributes.Moneda,
            table: "SAT_Cat_Currencies"
        }

        var resMoneda = await dbcatcatalogs.getCatalogIdShortDescription(paramsMoneda);

        var totalLetra = ""

        if(attributes.TipoDeComprobante !== "P")
        {
            totalLetra = numeroALetras(attributes.Total, {
                plural: resMoneda.toUpperCase(),
                singular: resMoneda.toUpperCase(),
            });
        }
        else {
            totalLetra = numeroALetras(attributes.Total, {
                plural: "".toUpperCase(),
                singular: "".toUpperCase(),
            });
        }

        //Para obtener el IVA
        var cadenaIVA = ""
        var cadenaIVAValor = ""

        logger.info('Obteniendo la información de los Impuestos');
        var impuestosF = jsonData.elements[0].elements.find( o => o.name === "cfdi:Impuestos");

        if(impuestosF !== undefined)
        {
            var trasladosN = impuestosF.elements.find( o => o.name === "cfdi:Traslados")
            
            if(trasladosN !== undefined)
            {
                var iva16 = trasladosN.elements.find( o => o.attributes.TasaOCuota === "0.160000")
                if(iva16 !== undefined)
                {
                    cadenaIVA = "I.V.A. 16%\n\n";
                    cadenaIVAValor = "$" + parseFloat(iva16.attributes.Importe).toLocaleString(undefined, {minimumFractionDigits: 2}) + "\n\n"
                }

                var iva0 = trasladosN.elements.find( o => o.attributes.TasaOCuota === "0.000000")
                if(iva0 !== undefined)
                {
                    cadenaIVA = "I.V.A. 0%\n\n";
                    cadenaIVAValor = "$" + parseFloat(iva0.attributes.Importe).toLocaleString(undefined, {minimumFractionDigits: 2}) + "\n\n"
                }
            }
        }

        var cadenaObligaciones = ""
        if(attributes.TipoDeComprobante !== "E" && attributes.TipoDeComprobante !== "P")
        {
            cadenaObligaciones = `DEBO(EMOS) Y PAGARE(MOS) A LA ORDEN DE ITW POLY MEX S DE RL DE CV A LA VISTA LA CANTIDAD INDICADA, PAGOS EFECTUADOS DESPUES DEL VENCIMIENTO CAUSARÁN INTERESES MORATORIOS A RAZÓN DEL % MENSUAL. \n\n`  + `${totalLetra} ${attributes.Moneda}`
        }
        else if(attributes.TipoDeComprobante === "E")
        {
            cadenaObligaciones = `${totalLetra} ${attributes.Moneda}`;
        }
        else if(attributes.TipoDeComprobante === "P")
        {
            cadenaObligaciones = `${totalLetra} ${attributes.Moneda}`;
        }
        
        var codigos = {
            table: {
                dontBreakRows: true,
                widths: [110, "*", 40,80],
                body: [
                    [
                        {image: temporalFilesPath + imageQR, width: 100, height: 100, alignment: 'center', verticalAlign: 'middle'},
                        {border: [false, true, true, true], text:  cadenaObligaciones, alignment: 'left', style: "textotablaEmisorReceptor"},
                        {border: [false, true, true, true], text:[
                            {text: "Subtotal\n\n", alignment: 'left', style: "textotablatotales"},
                            {text: cadenaIVA, alignment: 'left', style: "textotablatotales"},
                            {text: "Total", alignment: 'left', style: "textotablatotales"},
                        ]},
                        {border: [false, true, true, true], text:  [
                            {text: "$" + parseFloat(attributes.SubTotal).toLocaleString(undefined, {minimumFractionDigits: 2}) + "\n\n", alignment: 'left', style: "textotablatotales"},
                            {text:  cadenaIVAValor, alignment: 'left', style: "textotablatotales"},
                            {text:  "$" + parseFloat(attributes.Total).toLocaleString(undefined, {minimumFractionDigits: 2}) + "\n\n", alignment: 'left', style: "textotablatotales"}
                        ]},
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
                comercioExteriorTable,
                pagosTable,
                cfdiRelTable,
                leyendasF,
                norma,
                cadenasTable, 
                espacio1,
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
                    fontSize: 9,
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
                    color: '#000000',
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
                textotabla2: {
                    fontSize: 7,
                },
                textotabla3: {
                    fontSize: 5,
                },
                textotabla1: {
                    fontSize: 1,
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
                    fontSize: 8,
                },
                textotablaEmisorReceptorBold: {
                    fontSize: 8,
                    bold: true
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

            logger.info('Eliminando imagen Código QR');
            fs.unlinkSync(temporalFilesPath + imageQR)

            var chunks = [];
            var base64 = '';

            pdfDoc.on('data', function (chunk) {
                chunks.push(chunk);
            });
            
            logger.info('Convirtiendo PDF A Base 64');
            pdfDoc.on('end', function () {

                var result = Buffer.concat(chunks);

                base64 = result.toString('base64');

                let response = {
                    pdfBase64: base64,
                    emailTo : arrayEmailTo,
                    emailCC: arrayEmailCC,
                    poNumber: paramsEncabezado[30]
                }

                resolve(response);

            });

            pdfDoc.on('error', (error) => {
                var response = {
                    pdfBase64: "",
                    emailTo : arrayEmailTo,
                    emailCC: arrayEmailCC,
                    poNumber: paramsEncabezado[30]
                }

                reject(response)
            });

            pdfDoc.end();

        });

    } catch (err) {
        logger.info('Hubo un error al procesar el PDF de Polymex: ' + err);
        
        var response = {
            pdfBase64: "",
            emailTo : arrayEmailTo,
            emailCC: arrayEmailCC,
            poNumber: paramsEncabezado[30]
        }

        return response;
    }
    
}

getPDFPolymex33(IPM6203226B4_CFDI_RM9883_20221026, "/Users/alexishernandezolvera/Desktop/IPM6203226B4_RM_9883_20221026.txt", "/Users/alexishernandezolvera/Desktop/GTC/PROYECTOS/gtc-services-portal-api/utils/images/Logo_Polymex.png")

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
    }

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
    }

    function DecenasY(strSin, numUnidades) {
        if (numUnidades > 0)
            return strSin + ' Y ' + Unidades(numUnidades)

        return strSin;
    }

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
    }

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
    }

    function Miles(num) {
        let divisor = 1000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
        let strCentenas = Centenas(resto);

        if (strMiles == '')
            return strCentenas;

        return strMiles + ' ' + strCentenas;
    }

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
    getPDFPolymex33 : getPDFPolymex33
}