/*
 * Vencord WebInstaller, a web frontend for the Vencord Installer
 * Copyright (c) 2023 Vendicated, Justice Almanzar, and Vencord contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import type { SvelteComponent } from "svelte";
import { writable } from "svelte/store";
import type { Constructor, SetOptional } from "type-fest";

import type Window from "./DialogWindow.svelte";

type ComponentProps<T extends SvelteComponent> = T extends SvelteComponent<infer R> ? R : unknown;

type WindowInstance<T extends SvelteComponent = SvelteComponent> = {
    props: ComponentProps<Window>;
    content: Constructor<T>;
    contentProps: ComponentProps<T>;
};

export const windowStore = writable<Record<string, WindowInstance>>({});

export const openWindow = <T extends SvelteComponent>(
    component: Constructor<T>,
    props: ComponentProps<T>,
    windowOptions: SetOptional<ComponentProps<Window>, "id">
) => {
    const newWindow: WindowInstance<T> = {
        props: {
            id: Math.random().toString(36).substring(7),
            ...windowOptions
        },
        content: component,
        contentProps: props
    };
    windowStore.update(windows => {
        windows[newWindow.props.id] = newWindow;
        return windows;
    });
};

export const closeWindow = (id: string) => {
    windowStore.update(windows => {
        delete windows[id];
        return windows;
    });
};

let zIndex = 0;
export const getFocusZIndex = () => {
    zIndex++;
    return zIndex * 100;
};

export const setProps = (id: string, props: Partial<ComponentProps<Window>>) => {
    windowStore.update(windows => {
        windows[id].props = { ...windows[id].props, ...props };
        return windows;
    });
};
