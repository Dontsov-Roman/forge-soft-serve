import React from 'react';
import { Image, ImageProps, Tooltip } from '@forge/react';

type Props = {
    url: string;
    width?: ImageProps['width'];
    size?: ImageProps['size'];
    name?: string;
};

export const Avatar: React.FC<Props> = ({ url, name, width = 50, size = 'small' }) => {
    return (
        <Tooltip content={name}>
            <Image alt={name} size={size} width={width} src={url} />
        </Tooltip>
    )
}