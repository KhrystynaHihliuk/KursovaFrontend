import React, { useState, useEffect } from 'react';
import { TextField, IconButton, Button, Container, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, InputLabel, MenuItem, Select, FormControl } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './App.css';

function App() {
  const [tickets, setTickets] = useState([]);
  const [flightNumber, setFlightNumber] = useState('');
  const [departureDate, setDepartureDate] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      let url = 'https://airlineticketsmanage.azurewebsites.net/tickets';
      if (flightNumber !== '' && departureDate !== '') {
        url += `?flightNumber=${flightNumber}&departureDate=${departureDate}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const deleteTicket = async (id) => {
    try {
      const response = await fetch(`https://airlineticketsmanage.azurewebsites.net/tickets/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchTickets();
      } else {
        console.error('Failed to delete ticket');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  const addTicket = async (values, { resetForm }) => {
    try {
      const flightDurationInMinutes = values.durationUnit === 'hours' ? values.flightDuration * 60 : values.flightDuration;
      const newTicket = {
        ...values,
        flightDuration: flightDurationInMinutes
      };

      const response = await fetch('https://airlineticketsmanage.azurewebsites.net/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTicket)
      });
      if (response.ok) {
        resetForm();
        fetchTickets();
      } else {
        console.error('Failed to add ticket');
      }
    } catch (error) {
      console.error('Error adding ticket:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const params = new URLSearchParams({ flightNumber, departureDate });
      const url = `https://airlineticketsmanage.azurewebsites.net/tickets/search?${params.toString()}`;
      const response = await fetch(url);
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error searching tickets:', error);
    }
  };

  const clearFilters = () => {
    setFlightNumber('');
    setDepartureDate('');
    fetchTickets();
  };

  const validationSchema = Yup.object().shape({
    destination: Yup.string().required('Пункт призначення є обов\'язковим'),
    departure: Yup.string().required('Місце відправлення є обов\'язковим'),
    flightNumber: Yup.string().required('Номер рейсу є обов\'язковим'),
    passengerName: Yup.string().required('Прізвище та ініціали пасажира є обов\'язковими'),
    departureDate: Yup.string().required('Бажана дата вильоту є обов\'язковою'),
    flightDuration: Yup.number().required('Тривалість польоту є обов\'язковою').positive('Тривалість польоту має бути позитивною'),
    aircraftType: Yup.string().required('Тип літака є обов\'язковим'),
    durationUnit: Yup.string().required('Одиниця виміру є обов\'язковою')
  });

  return (
      <Container maxWidth="xl" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ position: 'relative', textAlign: 'center', color: 'white', overflow: 'hidden' }}>
          <img src="https://wallpapers.com/images/featured/plane-desktop-background-dnc62a0eoyniwrfl.jpg" alt="Airplane Background" style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
          <Typography variant="h3" component="h1" gutterBottom style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }}>
            Авіаквитки - Заявки
          </Typography>
        </div>
        <Grid container spacing={4} style={{ flexGrow: 1, marginTop: '20px' }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" component="h2" gutterBottom>
              Додати заявку
            </Typography>
            <Formik
                initialValues={{
                  destination: '',
                  departure: '',
                  flightNumber: '',
                  passengerName: '',
                  departureDate: '',
                  flightDuration: '',
                  aircraftType: '',
                  durationUnit: 'minutes'
                }}
                validationSchema={validationSchema}
                onSubmit={addTicket}
            >
              {({ errors, touched }) => (
                  <Form>
                    <Field as={TextField} fullWidth label="Пункт призначення" name="destination" margin="normal" error={touched.destination && !!errors.destination} helperText={touched.destination && errors.destination} />
                    <Field as={TextField} fullWidth label="Місце відправлення" name="departure" margin="normal" error={touched.departure && !!errors.departure} helperText={touched.departure && errors.departure} />
                    <Field as={TextField} fullWidth label="Номер рейсу" name="flightNumber" margin="normal" error={touched.flightNumber && !!errors.flightNumber} helperText={touched.flightNumber && errors.flightNumber} />
                    <Field as={TextField} fullWidth label="Тип літака" name="aircraftType" margin="normal" error={touched.aircraftType && !!errors.aircraftType} helperText={touched.aircraftType && errors.aircraftType} />
                    <Field as={TextField} fullWidth label="Прізвище та ініціали пасажира" name="passengerName" margin="normal" error={touched.passengerName && !!errors.passengerName} helperText={touched.passengerName && errors.passengerName} />
                    <Field as={TextField} fullWidth label="Бажана дата вильоту" name="departureDate" type="date" margin="normal" InputLabelProps={{ shrink: true }} error={touched.departureDate && !!errors.departureDate} helperText={touched.departureDate && errors.departureDate} />
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Field as={TextField} fullWidth label="Тривалість польоту" name="flightDuration" margin="normal" error={touched.flightDuration && !!errors.flightDuration} helperText={touched.flightDuration && errors.flightDuration} />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel id="durationUnitLabel">Одиниця виміру</InputLabel>
                          <Field as={Select} labelId="durationUnitLabel" name="durationUnit" label="Одиниця виміру">
                            <MenuItem value="minutes">Хвилини</MenuItem>
                            <MenuItem value="hours">Години</MenuItem>
                          </Field>
                        </FormControl>
                      </Grid>
                    </Grid>
                    <Button type="submit" variant="contained" fullWidth style={{ marginTop: '16px' }}>Додати заявку</Button>
                  </Form>
              )}
            </Formik>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" component="h2" gutterBottom>
              Фільтрувати заявки
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InputLabel id="flightNumberLabel">Номер рейсу</InputLabel>
                <TextField fullWidth labelid="flightNumberLabel" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} margin="normal" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel id="departureDateLabel">Дата вильоту</InputLabel>
                <TextField fullWidth type="date" labelid="departureDateLabel" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} margin="normal" InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} container spacing={1} alignItems="center">
                <Grid item>
                  <Button variant="contained" onClick={handleSearch}>Пошук</Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" onClick={clearFilters}>Скинути</Button>
                </Grid>
              </Grid>
            </Grid>
            <Typography variant="h5" component="h2" gutterBottom style={{ marginTop: '32px' }}>
              Список заявок на авіаквитки
            </Typography>
            <TableContainer component={Paper}>
              <Table style={{ tableLayout: 'fixed', width: '100%' }}>
                <TableHead>
                  <TableRow>
                    <TableCell style={{ width: '5%' }}>№</TableCell>
                    <TableCell style={{ width: '15%' }}>Пункт призначення</TableCell>
                    <TableCell style={{ width: '15%' }}>Місце відправлення</TableCell>
                    <TableCell style={{ width: '10%' }}>Номер рейсу</TableCell>
                    <TableCell style={{ width: '20%' }}>Прізвище та ініціали пасажира</TableCell>
                    <TableCell style={{ width: '15%' }}>Бажана дата вильоту</TableCell>
                    <TableCell style={{ width: '10%' }}>Тривалість польоту (години)</TableCell>
                    <TableCell style={{ width: '10%' }}>Дії</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(tickets) && tickets.length > 0 ? (
                      tickets.map((ticket, index) => (
                          <TableRow key={ticket.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{ticket.destination}</TableCell>
                            <TableCell>{ticket.departure}</TableCell>
                            <TableCell>
                              <Button
                                  color="primary"
                                  onClick={() => window.open(`https://www.flightaware.com/live/flight/${ticket.flightNumber}`, '_blank')}
                                  style={{ textTransform: 'none', padding: 0, color: 'black' }}
                              >
                                {ticket.flightNumber}
                              </Button>
                            </TableCell>
                            <TableCell>{ticket.passengerName}</TableCell>
                            <TableCell>{ticket.departureDate}</TableCell>
                            <TableCell>{(ticket.flightDuration / 60).toFixed(2)} {'год.'}</TableCell>
                            <TableCell>
                              <IconButton color="primary" onClick={() => deleteTicket(ticket.id)}>
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                      ))
                  ) : (
                      <TableRow>
                        <TableCell colSpan={8} style={{ textAlign: 'center' }}>
                          No tickets found
                        </TableCell>
                      </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
  );
}

export default App;
