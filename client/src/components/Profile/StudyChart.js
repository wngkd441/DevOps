import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
//
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader, Typography, Container, CardContent } from '@mui/material';
//
import { fNumber } from '../../utils/formatNumber';
import { BaseOptionChart } from '../charts';
import { getMyStudyCnt } from '../../_actions/user_actions';
import MyProgress from '../_dashboard/MyProgress';

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

export default function StudyChart() {
  // STATE
  const theme = useTheme();
  const [myStudyCnt, setMyStudyCnt] = useState([]);
  const [loading, setLoading] = useState(false);

  // INIT
  const dispatch = useDispatch();
  const getUserTechCnt = async () => {
    setLoading(true);
    await dispatch(getMyStudyCnt())
      .then((response) => {
        if (response) {
          setMyStudyCnt(response.payload.data.data);
        }
      })
      .catch(() => {
        console.log('나의 스터디 개수 받아오기 실패');
      });
    setLoading(false);
  };

  // RENDER
  useEffect(() => {
    getUserTechCnt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // CONDITIONAL
  if (loading) {
    return <MyProgress />;
  }

  // OPTIONS
  if (myStudyCnt.length !== 0) {
    const CHART_DATA = myStudyCnt.map((tech) => tech.techCount);
    const chartOptions = merge(BaseOptionChart(), {
      colors: [
        theme.palette.primary.main,
        theme.palette.info.main,
        theme.palette.warning.main,
        theme.palette.error.main
      ],
      labels: myStudyCnt.map((tech) => tech.techName),
      stroke: { colors: [theme.palette.background.paper] },
      legend: { floating: true, horizontalAlign: 'center' },
      dataLabels: { enabled: true, dropShadow: { enabled: false } },
      tooltip: {
        fillSeriesColor: false,
        y: {
          formatter: (seriesName) => fNumber(seriesName),
          title: {
            formatter: (seriesName) => `#${seriesName}`
          }
        }
      },
      plotOptions: {
        pie: { donut: { labels: { show: false } } }
      }
    });
    return (
      <Container>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography sx={{ fontSize: 14, mb: 5 }} color="primary" gutterBottom>
              스터디 기록
            </Typography>
            <ChartWrapperStyle dir="ltr">
              <ReactApexChart type="pie" series={CHART_DATA} options={chartOptions} height={280} />
            </ChartWrapperStyle>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Card sx={{ minWidth: 275, minHeight: 250 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14, mb: 5 }} color="primary" gutterBottom>
            스터디 기록
          </Typography>
          <Typography variant="h3" color="primary" sx={{ mt: '10%', ml: '30%' }}>
            스터디가 없습니다.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
