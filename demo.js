import * as React from 'react';
import { TextField, Grid } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import axios from 'axios';
import * as yup from 'yup';
import useYup from '@usereact/use-yup';

const schema = yup.object().shape({
  nama: yup.string().required('Nama harus diisi'),
  hargaSatuan: yup.string().required('Harga Satuan Ke harus diisi'),
  jumlahBarang: yup.string().required('Jumlah Barang harus diisi'),
});

const filter = createFilterOptions();

const getNpwp = async (params) => {
  const response = await axios.get(
    'https://javapi.pajakexpress.id:9901/efaktur/ref/npwp',
    {
      params: {
        limit: '5',
        jenis: 'pk',
        // npwp: params.npwp,
        npwp: params,
        nama: '',
        alamat: '',
      },
      headers: {
        'x-token':
          'e86798faccfcacd99720c0bcfed4cf09eeb29e52c26ab0a07df4927b42099801',
        Authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5NmRmZjU3OS1lYmYwLTRiZmYtOGRmMC0zYTc0YzUxMGVmNzkiLCJqdGkiOiIyNDhjMTBkNGM5ZWEwNTAwMDQ1ZTBjYWRhMTMyMTJmYWE2OGZhY2NlZTI1ZmExMTdlNzNlNWRkYTc0NmUxN2VjMDVhODg4MTRjMjQwNzEyZiIsImlhdCI6MTY1OTMyOTkzOC42MzQ3OTQsIm5iZiI6MTY1OTMyOTkzOC42MzQ3OTgsImV4cCI6MTY1OTMzNzEzOC41ODE0MjYsInN1YiI6IjIiLCJzY29wZXMiOltdfQ.mM-CatcXXJFxXQw-Ri95FJ-gdasYLeuAvDXvLPOR_Z6toFSJ1I8UF5cZju1fWYMxI1xdfIL5Wl3_uAMDKZeTBpBzT-Ud3ldqV_RiScCKbjbolRwmHDoddSg6RsWL2xNQEHvLCblJ1wqTBXv5uWNz9xq9gq4d9zUkZO3Ye8jm84GARtF2wanwkNHAu-q-F5q3riDc2pGzXmYeEn_zs_a1rRFsAWNo6xuMYTl-ITkbqJOQoRs4rPyMOos6keKOD-NPhkQEk1jmUDvMNNACKZX_HrEs6VYqWyj4CHrPVI3wH4l-4rL6V9UpKDbTGCxHHiT7VMMF6HlgjK7Kg_Br_jDKjLEFdrPaSV_dvEpxQQTsj5a43qB4fuNMBmgaaPgVDkRZ_BRCDArC_QlFFS1ZlddvvCpM8QPriPUlGnLcbJgzRzlTlkZ3sTOFo775EdDCh6QiiYz-mkoHLtd8gebzmQ0VQVsqMnIuBknIsX3hMKdNfkS_D4S0LhDOEtDHYckd0To4ew80BreHGXUbF3y3qGrsapyqgeXh7hOwmcetnCoRvyqnA6b6axYc2QT1maoflBkuTJXe2gymj1y_wvuhHrY43_oPZXCZGIeK9KByOkm_RZ7leOBHy7EIGYiAa7s5-TnHWAj2BKRd7qLcnx5BzltpLe1O_wS51d4TgoOeWHRf7HE',
      },
    }
  );
  const { data } = await response;

  return data;
};

export default function FreeSoloCreateOption() {
  const [data, setData] = React.useState({
    nama: '',
    hargaSatuan: 0,
    hargaTotal: 0,
    jumlahBarang: 0,
  });
  const [value, setValue] = React.useState(null);
  const [options, setOptions] = React.useState([]);
  const [exists, setExists] = React.useState([]);

  const { errors, validate } = useYup(data, schema, {
    validateOnChange: true,
  });

  const inputChangeHandler = (event) => {
    if (!exists.hasOwnProperty(event.target.name)) {
      setExists({ ...exists, [event.target.name]: true });
    }

    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  function helperText(myValue) {
    console.log(myValue, exists?.[myValue]);
    return exists?.[myValue] ? errors?.[myValue] : '';
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Autocomplete
            value={value}
            onKeyUp={(e) => {
              getNpwp(e?.target?.value).then((action) => {
                setOptions(action.data || []);
              });
            }}
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') {
                setValue({
                  npwp: newValue,
                });
              } else if (newValue && newValue.inputValue) {
                setValue({
                  npwp: newValue.inputValue,
                });
              } else {
                inputChangeHandler(event);
                setValue(newValue);
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              const { inputValue } = params;
              const isExisting = options.some(
                (option) => inputValue === option.npwp
              );
              if (inputValue !== '' && !isExisting) {
                filtered.push({
                  inputValue,
                  npwp: `Add "${inputValue}"`,
                });
              }

              return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id="free-solo-with-text-demo"
            options={options}
            getOptionLabel={(option) => {
              if (typeof option === 'string') {
                return option;
              }
              if (option.inputValue) {
                return option.inputValue;
              }
              return option.npwp;
            }}
            renderOption={(props, option) => <li {...props}>{option.npwp}</li>}
            sx={{ width: 300 }}
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                label="Free solo with text demo"
                name="nama"
                errors={!!errors?.nama && exists?.nama}
                helperText={helperText('nama')}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Jumlah Barang"
            fullWidth
            name="jumlahBarang"
            value={data.jumlahBarang}
            variant="outlined"
            onChange={inputChangeHandler}
            InputProps={{}}
            sx={{ input: { textAlign: 'right' } }}
            error={!!errors?.jumlahBarang && exists?.jumlahBarang}
            helperText={helperText('jumlahBarang')}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Harga Satuan"
            fullWidth
            name="hargaSatuan"
            value={data.hargaSatuan}
            onChange={inputChangeHandler}
            variant="outlined"
            InputProps={{}}
            sx={{ input: { textAlign: 'right' } }}
            error={!!errors?.hargaSatuan && exists?.hargaSatuan}
            helperText={helperText('hargaSatuan')}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Harga Total"
            fullWidth
            name="hargaTotal"
            value={data.hargaTotal}
            variant="outlined"
            inputProps={{
              readOnly: true,
            }}
            onChange={inputChangeHandler}
            sx={{ input: { textAlign: 'right' } }}
          />
        </Grid>
      </Grid>
    </>
  );
}
