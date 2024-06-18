import { fetchAllActionTypes, fetchAllActions } from '../../../entities';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { Box, Carousel } from '../../../shared';
import { FC, useEffect } from 'react';

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

  return (
    <Carousel>
      {actionTypes &&
        actions &&
        actions.map((elem) => {
          const color = actionTypes[elem.ActionType].color || 'white';
          const content = actionTypes[elem.ActionType].name || 'Unknown';
          return <Box backgroundColor={color} content={content} />;
        })}
    </Carousel>
  );
};
