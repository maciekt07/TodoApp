import { Keyframes, keyframes } from "@emotion/react";

export const fadeInLeft = keyframes`
from {
  opacity: 0;
  transform: translateX(-40px)
}
to {
  opacity: 1;
  transform: translateX(0px)
  }
`;

export const fadeIn = keyframes`
from {
  opacity: 0;
}
`;

export const slideIn = keyframes`
  from{
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const slideInBottom = keyframes`
  from{
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

export const scale = keyframes`
  from {
    transform: scale(0)
  }
  to {
    transform: scale(1)
  }
`;

/**
 * Creates a pulsating animation using scale and box-shadow to simulate a glowing effect.
 *
 * @param {string} clr - The base color for the shadow in hex.
 * @param {number} [shadowBlur=12] - The maximum spread of the shadow during the pulse.
 * @returns {Keyframes} An Emotion keyframes animation.
 */
export const pulseAnimation = (clr: string, shadowBlur: number = 12): Keyframes => keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 ${clr}b2;
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 ${shadowBlur}px ${clr}00;
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 ${clr}00;
  }
`;

/**
 * Creates a subtle glowing pulse animation for `ProgressPercentageContainer`.
 *
 * @param {string} clr - The base color of the glow in hex.
 * @returns {Keyframes} An Emotion keyframes animation.
 */
export const progressPulse = (clr: string): Keyframes => keyframes`
  0% {
    filter: none;
  }
  50% {
    filter: drop-shadow(0 0 10px ${clr}78);
  }
  100% {
    filter: none;
  }
`;

export const ring = keyframes`
  0% { -webkit-transform: rotateZ(0); }
  1% { -webkit-transform: rotateZ(30deg); }
  3% { -webkit-transform: rotateZ(-28deg); }
  5% { -webkit-transform: rotateZ(34deg); }
  7% { -webkit-transform: rotateZ(-32deg); }
  9% { -webkit-transform: rotateZ(30deg); }
  11% { -webkit-transform: rotateZ(-28deg); }
  13% { -webkit-transform: rotateZ(26deg); }
  15% { -webkit-transform: rotateZ(-24deg); }
  17% { -webkit-transform: rotateZ(22deg); }
  19% { -webkit-transform: rotateZ(-20deg); }
  21% { -webkit-transform: rotateZ(18deg); }
  23% { -webkit-transform: rotateZ(-16deg); }
  25% { -webkit-transform: rotateZ(14deg); }
  27% { -webkit-transform: rotateZ(-12deg); }
  29% { -webkit-transform: rotateZ(10deg); }
  31% { -webkit-transform: rotateZ(-8deg); }
  33% { -webkit-transform: rotateZ(6deg); }
  35% { -webkit-transform: rotateZ(-4deg); }
  37% { -webkit-transform: rotateZ(2deg); }
  39% { -webkit-transform: rotateZ(-1deg); }
  41% { -webkit-transform: rotateZ(1deg); }
  43% { -webkit-transform: rotateZ(0); }
  100% { -webkit-transform: rotateZ(0); }
`;
