import * as React from 'react';

export const navigationRef = React.createRef();

export function navigate(name) {
  navigationRef.current?.navigate(name);
}

export function navigateReset(name) {
  navigationRef.current?.reset({
    index: 0,
    routes: [{name: name}],
  });
}
