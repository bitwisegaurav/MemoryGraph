import React from 'react';
import { Text, TextStyle, ViewStyle } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
  style?: TextStyle | ViewStyle;
}

export const HomeIcon: React.FC<IconProps> = (props) => {
  const { size = 24, color = '#000', style } = props;
  return React.createElement(Text, { style: [{ fontSize: size, color, fontWeight: 'bold' }, style] }, 'H');
};

export const SearchIcon: React.FC<IconProps> = (props) => {
  const { size = 24, color = '#000', style } = props;
  return React.createElement(Text, { style: [{ fontSize: size, color, fontWeight: 'bold' }, style] }, 'S');
};

export const PlusIcon: React.FC<IconProps> = (props) => {
  const { size = 24, color = '#000', style } = props;
  return React.createElement(Text, { style: [{ fontSize: size, color, fontWeight: 'bold' }, style] }, '+');
};

export const UserIcon: React.FC<IconProps> = (props) => {
  const { size = 24, color = '#000', style } = props;
  return React.createElement(Text, { style: [{ fontSize: size, color, fontWeight: 'bold' }, style] }, 'U');
};

export const SparklesIcon: React.FC<IconProps> = (props) => {
  const { size = 24, color = '#000', style } = props;
  return React.createElement(Text, { style: [{ fontSize: size, color, fontWeight: 'bold' }, style] }, '*');
};

export const XIcon: React.FC<IconProps> = (props) => {
  const { size = 24, color = '#000', style } = props;
  return React.createElement(Text, { style: [{ fontSize: size, color, fontWeight: 'bold' }, style] }, 'X');
};

export const EditIcon: React.FC<IconProps> = (props) => {
  const { size = 24, color = '#000', style } = props;
  return React.createElement(Text, { style: [{ fontSize: size, color, fontWeight: 'bold' }, style] }, 'E');
};

export const SaveIcon: React.FC<IconProps> = (props) => {
  const { size = 24, color = '#000', style } = props;
  return React.createElement(Text, { style: [{ fontSize: size, color, fontWeight: 'bold' }, style] }, 'S');
};

export const LinkIcon: React.FC<IconProps> = (props) => {
  const { size = 24, color = '#000', style } = props;
  return React.createElement(Text, { style: [{ fontSize: size, color, fontWeight: 'bold' }, style] }, 'L');
};

export const ImageIcon: React.FC<IconProps> = (props) => {
  const { size = 24, color = '#000', style } = props;
  return React.createElement(Text, { style: [{ fontSize: size, color, fontWeight: 'bold' }, style] }, 'I');
};

export const FileTextIcon: React.FC<IconProps> = (props) => {
  const { size = 24, color = '#000', style } = props;
  return React.createElement(Text, { style: [{ fontSize: size, color, fontWeight: 'bold' }, style] }, 'F');
};

export const TrashIcon: React.FC<IconProps> = (props) => {
  const { size = 24, color = '#000', style } = props;
  return React.createElement(Text, { style: [{ fontSize: size, color, fontWeight: 'bold' }, style] }, 'D');
};
