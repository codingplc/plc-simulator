import React from "react";
import styled from "styled-components";

const Square = styled.div`
  margin: 0.25rem;
  position: relative;
  width: 4rem;
  &::after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`;
const SvgContainer = styled.div`
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10%;
  display: flex;
  position: absolute;
  height: 100%;
  width: 100%;
`;

interface Props {
  color?: string;
  enabled: boolean;
  onClick: () => void;
  Svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

const SvgButton: React.FC<Props> = (props: Props) => {
  const { color, enabled, onClick, Svg } = props;

  return (
    <Square onClick={enabled ? onClick : undefined}>
      <SvgContainer>
        <Svg
          style={{
            fill: color,
            height: "80%",
            margin: "auto",
            opacity: enabled ? "0.8" : "0.2",
            width: "80%",
          }}
        />
      </SvgContainer>
    </Square>
  );
};

export default SvgButton;
