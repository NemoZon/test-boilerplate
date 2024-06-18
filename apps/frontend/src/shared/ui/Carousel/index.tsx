import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import React, { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';

type Props = {
  width?: string;
  customSettings?: Settings;
};

const Container = styled.div<{ width?: string }>`
  width: ${(props) => props.width || '60%'};
`;

export const Carousel: FC<PropsWithChildren<Props>> = ({
  children,
  width,
  customSettings,
}) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Container className="slider-container" width={width}>
      <Slider {...(customSettings || settings)}>{children}</Slider>
    </Container>
  );
};
