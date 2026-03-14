import React, { useEffect, useState } from 'react'
import NotificationBar from '../notification/ServiceNotificationBar';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Card, CardContent, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
// import { FetchBranchService, FetchLocationService, SearchDevicesFetchService, UserDeviceReport } from '../../services/LoginPageService';
import { DownloadCustomerDeviceReport, DownloadDeviceReport } from '../../services/DownloadCsvReportsService';
import { FetchReportLocationService, SearchDevicesReportService, UserDeviceReport } from '../../services/LoginPageService';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const ReportUserList = () => {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [Locationid, setLocationId] = useState('');
    const [deviceList, setDeviceList] = useState([]);
    const [locationList, setLocationList] = useState([]);
    const [gridLoading, setGridLoading] = useState(false);

    const [data, setData] = useState([]);

    const [headers, setHeaders] = useState([]);


    const [openNotification, setNotification] = useState({
        status: false,
        type: 'error',
        message: '',
    });


    useEffect(() => {
        FetchReportLocationService(handleLocationSuccess, handleLocationException);

    }, []);

    const handleLocationSuccess = (dataObject) => {
        setLocationList(dataObject.data || []);
        // if (locationDetails?.locationId) {
        //     setLocationId(locationDetails?.locationId);
        //     FetchBranchService({ locationId: locationDetails?.locationId }, BranchHandleSuccess, BranchHandleException);
        // }
    };
    const handleLocationException = () => { };

    const BranchHandleSuccess = (dataObject) => {
        setDeviceList(dataObject.data || []);

    };
    const BranchHandleException = () => { };
    const HandleDeviceChange = (deviceId) => {
        setDeviceId(deviceId);
    };

    const HandleLocationChange = (Locationid) => {
        setLocationId(Locationid);
        if (Locationid) {
            SearchDevicesReportService({
                locationId: Locationid,
            }, BranchHandleSuccess, BranchHandleException);
        }
    };


    const handleClose = () => {
        setNotification({
            status: false,
            type: '',
            message: '',
        });
    };

    const calculateOneMonthFrom = (date) => {
        const selectedDate = new Date(date);
        const oneMonthFromSelectedDate = new Date(selectedDate);
        oneMonthFromSelectedDate.setMonth(oneMonthFromSelectedDate.getMonth() + 1);
        const year = oneMonthFromSelectedDate.getFullYear();
        const month = String(oneMonthFromSelectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(oneMonthFromSelectedDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        setGridLoading(true);

        UserDeviceReport({
            fromDate, toDate, locationId: Locationid, deviceId
        }, AlarmReportHandleSuccess, AlarmReportHandleException);
    };

    const handleCancel = () => {
        setFromDate('');
        setToDate('');
        setDeviceId('');
        setHeaders([]);
        setData([]);
        setLocationId('')
    };
    const AlarmReportHandleSuccess = (dataObject) => {
        setData(dataObject?.data || [])
        setHeaders(dataObject?.headers || [])
        setNotification({
            status: true,
            type: 'success',
            message: "Success",
        });
        setTimeout(() => {
            handleClose();
        }, 3000);
        setGridLoading(false);
    };

    const AlarmReportHandleException = (errorObject, errorMessage) => {
        setGridLoading(false);
        setNotification({
            status: true,
            type: 'error',
            message: errorMessage,
        });
        setTimeout(() => {
            handleClose();
        }, 3000);

    };


    // const DownloadCsv = () => {
    //     if (fromDate !== '' && toDate !== '') {
    //         DownloadDeviceReport({
    //             fromDate, toDate, locationId: Locationid, deviceId
    //         }, csvReportHandleSuccess, csvReportHandleException);
    //     } else {
    //         setNotification({
    //             status: true,
    //             type: 'error',
    //             message: 'Please select a date range',
    //         });
    //     }
    // };

    const DownloadCsv = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('My Sheet');

        // Build headers
        let row1 = [];
        let row2 = [];

        headers.forEach((header) => {
            if (header.subHeaders) {
                row1.push({
                    header: header.group,
                    key: header.group,
                    colSpan: header.subHeaders.length
                });
                header.subHeaders.forEach((subHeader) => row2.push(subHeader));
            } else {
                row1.push({ header: header.group, key: header.group });
                row2.push(""); // Empty for rowspan cell
            }
        });

        // Add header rows manually for complex structure
        worksheet.addRow(row1.map(h => h.header));
        worksheet.addRow(row2);

        // Merge cells for colSpans
        let colIndex = 1;
        headers.forEach((header) => {
            if (header.subHeaders) {
                worksheet.mergeCells(1, colIndex, 1, colIndex + header.subHeaders.length - 1);
                colIndex += header.subHeaders.length;
            } else {
                worksheet.mergeCells(1, colIndex, 2, colIndex);
                colIndex += 1;
            }
        });

        // Add data rows
        Object.entries(data).forEach(([timestamp, rowData]) => {
            const row = [timestamp];
            headers.slice(1).forEach((header) => {
                header.subHeaders.forEach((subHeader) => {
                    row.push(rowData[header.group]?.[subHeader] || '');
                });
            });
            worksheet.addRow(row);
        });

        // Style borders (optional)
        worksheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            });
        });

        // Generate and trigger download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        saveAs(blob, 'table-data.xlsx');
    };

    const csvReportHandleSuccess = () => {
        setTimeout(() => {
        }, 2000);
    };

    const csvReportHandleException = () => {
        setTimeout(() => {
            setNotification({
                status: true,
                type: 'error',
                message: 'Something went wrong...',
            });
        }, 2000);
    };
    const parseValue = (value) => {
        return value !== undefined && value !== null ? parseFloat(value).toFixed(2) : "0.00";
    };

    const renderHeaders = () => (
        <>
            <tr>
                {headers.map((header, idx) =>
                    header.subHeaders ? (

                        <th key={idx} colSpan={header.subHeaders.length} style={{ border: "1px solid black", padding: "8px" }}>
                            {header.group}
                        </th>
                    ) : (

                        <th key={idx} rowSpan="2" style={{ border: "1px solid black", padding: "8px" }}>
                            {header.group}
                        </th>
                    )
                )}
            </tr>
            <tr>
                {headers
                    .filter((header) => header.subHeaders)
                    .flatMap((header) =>
                        header.subHeaders.map((subHeader, idx) => (
                            // <th key={idx}>{subHeader}</th>
                            <th key={idx} style={{ border: "1px solid black", padding: "8px" }}>
                                {subHeader}
                            </th>
                        ))
                    )}
            </tr>
        </>
    );



    const renderRows = () =>
        Object.entries(data).map(([timestamp, rowData], idx) => (
            <tr key={idx}>
                {/* <td>{timestamp}</td> */}
                <td style={{ border: "1px solid black", padding: "8px" }}>{timestamp}</td>
                {headers.slice(1).flatMap((header) =>
                    header.subHeaders.map((subHeader) => {
                        const value = rowData[header.group]?.[subHeader]; // Fix here: access using exact group name
                        console.log(`Timestamp: ${timestamp}, Group: ${header.group}, Key: ${subHeader}, Value: ${value}`);
                        return (
                            <td key={`${header.group}-${subHeader}`} style={{ border: "1px solid black", padding: "8px" }}>
                                {parseValue(value)}
                            </td>
                        );
                    })
                )}
            </tr>
        ));
    return (
        <Box sx={{ width: '100%', height: '85vh', padding: '20px' }}>
            <Card className={'mt-[15px]'} style={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px', borderRadius: '12px', }}>

                <CardContent className={'min-h-[550px]'} style={{ border: 'none', }}>

                    {/* <div style={{ height: 425, width: '100%' }}> */}
                    <Grid item>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={1}>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={3}
                                    lg={3}
                                    xl={3}
                                >
                                    <TextField
                                        fullWidth
                                        label="From Date"
                                        type="date"
                                        value={fromDate}
                                        variant="outlined"
                                        size='small'
                                        required
                                        onChange={(e) => {
                                            setFromDate(e.target.value);
                                        }}
                                        autoComplete="off"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        // inputProps={{
                                        //   max: currentDateValidator()
                                        // }}
                                        inputProps={{
                                            max: calculateOneMonthFrom(toDate), // Set max date based on selectDateTo
                                        }}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={6}
                                    md={3}
                                    lg={3}
                                    xl={3}
                                >
                                    <TextField
                                        fullWidth
                                        label="To Date"
                                        type="date"
                                        value={toDate}
                                        variant="outlined"
                                        size='small'

                                        required
                                        onChange={(e) => {
                                            setToDate(e.target.value);
                                        }}
                                        autoComplete="off"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        // inputProps={{
                                        //   max: currentDateValidator()
                                        // }}
                                        inputProps={{
                                            min: fromDate, // Set min date based on selectDateFrom
                                            max: calculateOneMonthFrom(fromDate), // Set max date based on selectDateFrom
                                        }}
                                    />

                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={3}
                                    lg={3}
                                    xl={3}
                                >
                                    <FormControl fullWidth>
                                        <InputLabel>Location</InputLabel>
                                        <Select
                                            value={Locationid}
                                            size='small'

                                            label="Devices"
                                            onChange={(e) => {
                                                HandleLocationChange(e.target.value);
                                            }}
                                        >
                                            <MenuItem value="" key={0}>
                                                <em style={{ fontWeight: 'bold' }}>All</em>
                                            </MenuItem>
                                            {locationList.map((data, index) => (
                                                <MenuItem value={data.id} key={index + 1}>
                                                    {data.loc_name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={3}
                                    lg={3}
                                    xl={3}
                                >
                                    <FormControl fullWidth>
                                        <InputLabel>Devices</InputLabel>
                                        <Select
                                            value={deviceId}
                                            size='small'

                                            label="Devices"
                                            onChange={(e) => {
                                                HandleDeviceChange(e.target.value);
                                            }}
                                        >
                                            <MenuItem value="" key={0}>
                                                <em style={{ fontWeight: 'bold' }}>All</em>
                                            </MenuItem>
                                            {deviceList?.map((data, index) => (
                                                <MenuItem value={data.id} key={index + 1}>{data.deviceName}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={3}
                                    md={3}
                                    lg={3}
                                    xl={2}
                                    style={{
                                        alignSelf: 'center',
                                    }}
                                >
                                    <FormControl fullWidth>
                                        <Button size="medium" variant="contained" autoFocus type="submit" sx={{
                                            backgroundColor: "#051622", color: "#ffff",
                                            "&:hover": {
                                                backgroundColor: "#183b52", // Change to your desired hover color
                                            },
                                        }}
                                            onClick={handleSubmit}
                                        >
                                            Submit
                                        </Button>
                                    </FormControl>
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={3}
                                    md={3}
                                    lg={3}
                                    xl={2}
                                    style={{
                                        alignSelf: 'center',
                                    }}
                                >
                                    <FormControl fullWidth>
                                        <Button size="medium" variant="contained" autoFocus onClick={handleCancel} sx={{
                                            backgroundColor: "#051622", color: "#ffff",
                                            "&:hover": {
                                                backgroundColor: "#183b52", // Change to your desired hover color
                                            },
                                        }}>
                                            Cancel
                                        </Button>
                                    </FormControl>
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    sm={3}
                                    md={3}
                                    lg={3}
                                    xl={2}
                                    style={{
                                        alignSelf: 'center',
                                    }}
                                >
                                    <FormControl fullWidth>
                                        <Button
                                            size="medium"
                                            sx={{
                                                backgroundColor: "#051622", color: "#ffff",
                                                "&:hover": {
                                                    backgroundColor: "#183b52", // Change to your desired hover color
                                                },
                                            }}
                                            variant="contained"
                                            autoFocus
                                            onClick={() => {
                                                DownloadCsv();
                                            }}
                                        //   endIcon={enableDownload === true ? <CircularProgress style={{ height: '25px', width: '25px' }} /> : <DownloadIcon />}
                                        //   disabled={enableDownload}
                                        >
                                            Download
                                        </Button>
                                    </FormControl>
                                </Grid>

                                {/* <div style={{ height: '64vh', width: '100%', marginTop: 12, overflowY: 'auto' }}>
                                     <DataGrid
                                        rows={alarmReportList}
                                        // rowCount={rowCountState}

                                        // pagination
                                        // page={page}
                                        // pageSize={pageSize}
                                        // paginationMode="server"
                                        // onPageChange={onPageChange}
                                        // onPageSizeChange={onPageSizeChange}
                                        columns={columns}
                                        // rowHeight={70}
                                        // getRowHeight={() => 'auto'}
                                        pageSize={100}
                                    /> 
                                    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid black" }}>
                                        <thead>{renderHeaders()}</thead>
                                        <tbody>{renderRows()}</tbody>
                                    </table>
                                </div> */}
                                {gridLoading ? (
                                    <div style={{ width: "100%", textAlign: 'center', padding: '20px', fontSize: '26px', fontStyle: 'bold' }}>
                                        Loading...
                                    </div>
                                ) : (
                                    <div style={{ height: '64vh', width: '100%', marginTop: 12, overflowY: 'auto' }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid black" }}>
                                            <thead>{renderHeaders()}</thead>
                                            <tbody>{renderRows()}</tbody>
                                        </table>
                                    </div>
                                )}

                            </Grid>
                        </form>
                        <NotificationBar
                            handleClose={handleClose}
                            notificationContent={openNotification.message}
                            openNotification={openNotification.status}
                            type={openNotification.type}
                        />
                    </Grid>


                </CardContent>
            </Card>
        </Box>
    )
}

export default ReportUserList



