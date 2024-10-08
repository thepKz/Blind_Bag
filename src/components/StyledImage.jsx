import styled from 'styled-components';

const StyledImage = styled.img`
  width: 250px;
  height: 250px;
  object-fit: cover;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export default StyledImage;