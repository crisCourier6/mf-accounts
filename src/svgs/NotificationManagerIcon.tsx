import React from 'react';
import IconProps from '../interfaces/IconProps';

const NotificationManagerIcon: React.FC<IconProps> = ({ width = "100%", height = "100%", fill = "#425a6c" }) => {
  return (
    <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={width} height={height}>
	<title>notification-manager</title>
	<path id="Path 0" className="s0" fill={fill} d="m255.5 0.1c6-0.1 9.6 0.5 14.5 2.2 3.6 1.3 8.5 3.7 11 5.4 2.5 1.6 6.3 5 8.5 7.5 2.2 2.4 5.2 6.9 6.6 9.9 1.5 3 3.1 7.8 3.8 10.7 0.6 2.8 1.1 10.9 1.1 30.7l6.7 2.4c3.8 1.3 11.3 4.6 16.8 7.3 5.5 2.7 13.6 7.4 18 10.3 4.4 3 11.4 8.4 15.5 12 4.1 3.7 10.6 10.1 14.3 14.3 3.7 4.2 9.2 11.3 12.1 15.7 3 4.4 7.2 11.6 9.4 16 2.2 4.4 5.2 10.9 6.6 14.5 1.5 3.6 3.8 10.6 5.1 15.5 1.4 4.9 3.2 13.9 4 20 1 7.9 1.5 20.8 1.5 79.5l-11.3 11.1c-6.1 6.1-12.2 11.9-13.5 12.8-1.2 0.9-2.4 1.4-2.6 1.1-0.2-0.3-0.9-6.2-1.5-13.3-0.6-7-1.1-27.7-1.1-45.9 0-24.2-0.4-35.9-1.5-42.8-0.8-5.2-2.4-12.9-3.5-17-1.2-4.1-4.3-12-6.9-17.5-2.6-5.5-7.2-13.6-10.1-18-3-4.4-8.8-11.5-13-15.9-4.1-4.3-11.1-10.5-15.5-13.8-4.4-3.3-13.4-8.6-20-11.9-6.6-3.2-15.4-6.8-19.5-7.9-4.1-1.1-11.8-2.7-17-3.5-5.2-0.8-13.3-1.5-18-1.5-4.7 0-12.8 0.7-18 1.5-5.2 0.8-12.9 2.4-17 3.5-4.1 1.2-12 4.3-17.5 6.9-5.5 2.6-13.6 7.1-18 10.1-4.4 3-12.3 9.7-17.6 14.9-5.3 5.3-11.9 13-14.6 17.1-2.8 4.1-6.9 11.2-9.2 15.7-2.2 4.6-5.2 11.6-6.5 15.5-1.4 4-3.2 10.7-4.1 14.8-1.4 6.1-1.9 16.1-2.5 53-0.7 37.8-1.1 47.7-2.8 58.5-1.1 7.1-3.2 17.9-4.7 24-1.5 6.1-4.4 16.2-6.5 22.5-2.1 6.3-5.7 15.8-8 21-2.3 5.2-6.5 14-9.5 19.5-2.9 5.5-8.6 14.9-12.7 21-4 6.1-7.4 11.3-7.6 11.7-0.1 0.5 43.2 0.8 192.8 0.8l-0.6 4.2c-0.4 2.4-1.2 5.9-1.9 7.8-0.7 1.9-1.9 6.8-4 18h-51.5l0.6 2.2c0.3 1.3 2 4.5 3.8 7.2 1.7 2.7 5.2 6.8 7.7 9 2.5 2.3 6.8 5.2 9.5 6.5 2.7 1.4 7.1 3 9.9 3.8 2.7 0.7 7.1 1.3 9.7 1.3 4.7 0 4.8 0.1 6.7 4.2 1 2.4 2.7 5 3.7 5.9 1 0.9 3.5 2.2 5.4 2.8 1.9 0.6 6.6 1.2 10.5 1.2 3.9 0 9.9-0.5 13.5-1.1 3.6-0.7 7.2-1 8-0.8 0.9 0.3-1.1 2.1-5.5 5-3.9 2.5-9 5.4-11.5 6.5-2.5 1.1-8 3-12.3 4.2-5.6 1.5-10.5 2.1-18 2.1-7.9 0-12.1-0.6-18.7-2.6-4.7-1.3-11.2-3.9-14.5-5.5-3.3-1.7-8-4.6-10.5-6.4-2.5-1.9-7-6-10.2-9.2-3.1-3.2-7.2-8.3-9.1-11.3-1.9-3-4.6-8.4-6.1-12-1.4-3.6-2.8-8-3.6-13h-70c-68 0-70.1-0.1-74-2-2.7-1.4-4.7-3.3-6.1-6.3-1.6-3.2-2-5.3-1.6-8.7 0.4-2.9 1.6-5.6 3.4-7.7 1.5-1.7 6.6-7.5 11.1-13 4.6-5.4 11.8-15 16-21.3 4.2-6.3 10.4-16.9 13.7-23.5 3.4-6.6 8.2-17.6 10.7-24.5 2.5-6.9 6-18.1 7.7-25 1.6-6.9 3.7-17.2 4.7-23 1.2-7.9 1.8-21.9 2.4-56 0.6-32.9 1.2-47.6 2.3-53 0.8-4.1 2.4-10.9 3.6-15 1.1-4.1 3-10 4.2-13 1.1-3 4.1-9.6 6.6-14.5 2.4-4.9 6.9-12.6 9.9-17 2.9-4.4 8.2-11.3 11.6-15.2 3.5-4 9.9-10.4 14.3-14.3 4.4-3.9 11.6-9.4 16-12.4 4.4-3 12-7.4 17-9.9 4.9-2.4 12.5-5.8 24.5-10.2v-12.8c0-7 0.5-15.1 1.1-18 0.6-2.8 2.3-7.7 3.7-10.7 1.5-3.2 5.1-8 8.6-11.5 3.4-3.4 7.9-6.9 10.1-8 2.2-1 6-2.6 8.5-3.6 2.8-1.1 7.5-1.7 12.5-1.8zm-12.7 38.1c-1.3 2.4-1.7 5.9-1.8 12.8v9.5h30c0-16.5-0.4-19.4-2-22.5q-2-4-6-6c-2.2-1.1-5.5-2-7.3-2-1.7 0-5 1.1-7.2 2.5-2.2 1.3-4.8 3.9-5.7 5.7zm-135.3 13.8c3.4 0 6 0.7 8 2 1.7 1.1 3.8 3.3 4.7 4.8 1.1 1.6 1.8 4.7 1.8 7.7 0.1 4-0.5 5.8-2.7 8.7-1.5 2-6.3 7.6-10.7 12.5-4.3 4.8-11 13.5-14.8 19.3-3.9 5.8-9.7 15.9-12.9 22.5-3.2 6.6-7.6 17.4-9.8 24-2.2 6.6-4.9 16.5-6 22-1.1 5.5-2.5 14.7-3.1 20.5-0.5 5.8-1 13.1-1 16.2 0 3.8-0.7 7.2-2 9.8q-2 4-6 6c-2.2 1.1-5.4 2-7 2-1.6 0-4.8-0.9-7-2q-4-2-6-6c-1.4-2.7-2-6-2-10.3 0-3.4 0.5-11.4 1.1-17.7 0.5-6.3 2.1-17 3.5-23.8 1.3-6.7 4.5-18.6 7.1-26.5 2.6-7.8 7.7-20.3 11.4-27.7 3.7-7.4 9.5-17.8 12.9-23 3.5-5.2 8.2-12 10.5-15 2.4-3 7.6-9.2 11.6-13.8 4.1-4.5 8.7-9.1 10.4-10.2 2-1.3 4.7-2 8-2zm364 194.1c1.6-0.1 5.5 0.6 8.5 1.5 4.7 1.4 7 3.1 15.9 11.8 5.6 5.5 11.5 12.1 13 14.6 2.2 3.8 2.6 5.7 2.6 12 0 5.4-0.6 8.5-1.9 11-1 1.9-6.4 8.1-12 13.8-5.5 5.6-10.4 10.2-10.9 10.2-0.4 0-11.7-11-25.2-24.5-13.5-13.5-24.5-24.8-24.5-25.3 0-0.4 4.8-5.5 10.7-11.3 8.9-8.7 11.7-10.9 15.8-12.2 2.7-0.9 6.4-1.6 8-1.6zm-67-194.1c3.6 0 5.9 0.6 8.2 2.2 1.8 1.3 6.1 5.5 9.5 9.3 3.5 3.9 8.6 10 11.4 13.5 2.8 3.6 7.9 10.8 11.4 16 3.4 5.2 9.3 15.8 13.1 23.5 3.8 7.7 8.8 20.1 11.3 27.5 2.4 7.4 5.6 19.3 7 26.5 1.4 7.1 3 17.9 3.6 24 0.5 6 1 13.8 1 17.2 0 4.3-0.6 7.6-2 10.3q-2 4-6 6c-2.2 1.1-5.4 2-7 2-1.6 0-4.8-0.9-7-2q-4-2-6-6c-1.3-2.6-2-6-2-9.8 0-3.1-0.5-10.4-1-16.2-0.6-5.8-2-15-3.1-20.5-1.1-5.5-3.8-15.4-6-22-2.2-6.6-6.6-17.4-9.8-24-3.2-6.6-9-16.7-12.9-22.5-3.9-5.8-10.4-14.2-14.4-18.8-4-4.6-8.8-10.1-10.6-12.3-2.7-3.3-3.2-4.7-3.2-9.2 0-3.8 0.6-6 2.2-8.1 1.1-1.5 3.3-3.7 4.7-4.7 1.7-1.2 4.3-1.9 7.6-1.9zm17.5 234c0.3 0 11.8 11.2 50.5 50l-132 131.6-60.5 14.9-4.5-4.5 14.9-60.5 65.5-65.8c36.1-36.1 65.8-65.7 66.1-65.7zm23 100c0.3 0 2.3 2.8 4.5 6.2 2.2 3.4 7 10.1 10.6 14.8 3.6 4.7 9 11.2 12.1 14.5 3 3.3 6.3 7.5 7.2 9.3 0.9 1.7 1.6 4.6 1.6 6.2 0 1.6-0.9 4.8-2 7q-2 4-6 6c-3.8 1.9-5.7 2-95.2 1.5l4.5-6c2.5-3.3 8.1-9.9 20.7-23.5h15c8.3 0 15-0.2 15-0.5 0-0.3-2.6-4.1-5.7-8.6-5.1-7.1-5.6-8.2-4.3-9.5 0.8-0.7 6-5 11.5-9.3 5.5-4.4 10.2-8 10.5-8.1z"/>
</svg>
  );
}

export default  NotificationManagerIcon;