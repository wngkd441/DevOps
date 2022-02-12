import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// material
import { styled } from '@mui/material/styles';
import {
  FormLabel,
  FormControl,
  FormControlLabel,
  Checkbox,
  Link,
  Card,
  Grid,
  CardContent,
  Button
} from '@mui/material';
import {
  getReservedList,
  getCheckedtimeList,
  saveMentoringTime
} from '../../_actions/mentor_actions';

// eslint-disable-next-line prefer-const
let testdata = [
  {
    time: '00:00',
    reserved: false,
    checked: false
  },
  {
    time: '02:00',
    reserved: false,
    checked: false
  },
  {
    time: '04:00',
    reserved: false,
    checked: false
  },
  {
    time: '06:00',
    reserved: false,
    checked: false
  },
  {
    time: '08:00',
    reserved: false,
    checked: false
  },
  {
    time: '10:00',
    reserved: false,
    checked: false
  },
  {
    time: '12:00',
    reserved: false,
    checked: false
  },
  {
    time: '14:00',
    reserved: false,
    checked: false
  },
  {
    time: '16:00',
    reserved: false,
    checked: false
  },
  {
    time: '18:00',
    reserved: false,
    checked: false
  },
  {
    time: '20:00',
    reserved: false,
    checked: false
  },
  {
    time: '22:00',
    reserved: false,
    checked: false
  }
];

const TitleStyle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical'
});

export default function MentorWeeklySetting({ week, day, date }) {
  console.log(date);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [times, setTime] = useState([]);
  const [checkedInputs, setCheckedInputs] = useState([]);

  const changeHandler = (checked, id) => {
    if (checked) {
      setCheckedInputs([...checkedInputs, id]);
    } else {
      setCheckedInputs(checkedInputs.filter((el) => el !== id));
    }
    console.log(checkedInputs);
  };

  const MySwal = withReactContent(Swal);

  const getCheckedTime = () => {
    const dataToSubmit = {
      mentorTime: date,
      mentorSeq: id
    };
    dispatch(getCheckedtimeList(dataToSubmit))
      .then((response) => {
        if (response) {
          console.log('test!!!!!!!!!!!!');
          const filter1 = response.payload[0].time;
          console.log(filter1);
          setCheckedInputs(filter1);
          // eslint-disable-next-line guard-for-in
          for (const i in filter1) {
            const hour = filter1[i].substring(0, 2);
            const hournum = Number(hour / 2);
            console.log(checkedInputs);
            testdata[hournum].checked = true;
          }
        }
        setTime(testdata);
        console.log(times);
      })
      .catch((err) => {
        setTimeout(() => {}, 3000);
      });
  };

  const getReservedTeam = () => {
    const dataToSubmit = {
      mentorTime: date,
      mentorSeq: id
    };
    dispatch(getReservedList(dataToSubmit))
      .then((response) => {
        if (response) {
          console.log('test!!!!!!!!!!!!');
          const filter2 = response.payload[0].time;
          // eslint-disable-next-line guard-for-in
          for (const i in filter2) {
            const hour = filter2[i].substring(0, 2);
            const hournum = Number(hour / 2);
            testdata[hournum].reserved = true;
          }
        }
        setTime(testdata);
      })
      .catch((err) => {
        setTimeout(() => {}, 3000);
      });
  };

  const submit = async () => {
    console.log(checkedInputs);
    const dataToSubmit = {
      mentorTime: checkedInputs
    };
    await dispatch(saveMentoringTime(dataToSubmit))
      .then((response) => {
        if (response) {
          Swal.fire('저장', '시간 설정이 완료되었습니다.', 'success').then(() => {});
        }
      })
      .catch((err) => {
        setTimeout(() => {
          Swal.fire({
            icon: 'error',
            title: '실패',
            text: '멘토링 저장에 실패하였습니다.'
          });
        }, 3000);
      });
  };

  useEffect(() => {
    getCheckedTime();
    getReservedTeam();
  }, [times]);

  return (
    <Grid item xs={0} sm={0} md={0}>
      <Card sx={{ minWidth: 300 }}>
        <CardContent>{day}일 예약 일정 설정</CardContent>
        <CardContent>
          <FormControl>
            <FormLabel>시간 선택</FormLabel>
            {times.map((post, index) => (
              // eslint-disable-next-line react/jsx-key
              <FormControlLabel
                disabled={post.reserved}
                control={<Checkbox defaultChecked={post.checked} />}
                onChange={(e) => {
                  changeHandler(e.currentTarget.checked, post.time);
                }}
                value={post.time}
                label={post.time}
              />
            ))}
          </FormControl>
        </CardContent>
      </Card>
      <Button onClick={submit}>저장하기</Button>
    </Grid>
  );
}
