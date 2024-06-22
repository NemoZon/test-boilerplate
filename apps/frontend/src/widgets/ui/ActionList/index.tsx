import { fetchAllActionTypes, fetchAllActions } from '../../../entities';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Box, Carousel } from '../../../shared';
import { FC, useEffect } from 'react';
import styled from 'styled-components';

const settings = {
  infinite: false,
  speed: 500,
  dots: true,
  slidesToShow: 6,
  slidesToScroll: 1,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Text = styled.h1`
  text-align: center;
  margin-bottom: 10px;
`;

export const ActionList: FC = () => {
  const dispatch = useAppDispatch();
  const { actions, status: actionStatus } = useAppSelector(
    (state) => state.action
  );
  const { actionTypes, status: actionTypeStatus } = useAppSelector(
    (state) => state.actionType
  );

  useEffect(() => {
    if (actionStatus === 'idle') {
      dispatch(fetchAllActions());
    }
    if (actionTypeStatus === 'idle') {
      dispatch(fetchAllActionTypes());
    }
  }, [dispatch]);

  if (actions.length > 30) {
    settings.slidesToScroll = 6;
  } else {
    settings.slidesToScroll = 1;
  }

  return (
    <Container>
      <Text>Total elements: {actions.length}</Text>
      <Carousel customSettings={settings}>
        {Object.keys(actionTypes).length > 0 &&
          actions.map((elem, i) => {
            const color = actionTypes[elem.ActionType].color || 'white';
            const content = actionTypes[elem.ActionType].name || 'Unknown';
            return (
              <div key={elem._id}>
                <Box
                  key={elem._id}
                  index={i}
                  backgroundColor={color}
                  content={`Action ${content}`}
                />
              </div>
            );
          })}
      </Carousel>
    </Container>
  );
};
