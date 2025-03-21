/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";

import { Button, H5, HotkeysTarget2, KeyCombo, MenuItem, Position, Switch, Toaster } from "@blueprintjs/core";
import { Example, ExampleProps, handleBooleanChange } from "@blueprintjs/docs-theme";
import { Omnibar } from "@blueprintjs/select";

import {
    areFilmsEqual,
    createFilm,
    filterFilm,
    IFilm,
    renderCreateFilmOption,
    renderFilm,
    TOP_100_FILMS,
} from "./../../common/films";

const FilmOmnibar = Omnibar.ofType<IFilm>();

export interface IOmnibarExampleState {
    allowCreate: boolean;
    isOpen: boolean;
    resetOnSelect: boolean;
}

export class OmnibarExample extends React.PureComponent<ExampleProps, IOmnibarExampleState> {
    public state: IOmnibarExampleState = {
        allowCreate: false,
        isOpen: false,
        resetOnSelect: true,
    };

    private handleAllowCreateChange = handleBooleanChange(allowCreate => this.setState({ allowCreate }));

    private handleResetChange = handleBooleanChange(resetOnSelect => this.setState({ resetOnSelect }));

    private toaster: Toaster;

    private refHandlers = {
        toaster: (ref: Toaster) => (this.toaster = ref),
    };

    public render() {
        const { allowCreate } = this.state;

        const maybeCreateNewItemFromQuery = allowCreate ? createFilm : undefined;
        const maybeCreateNewItemRenderer = allowCreate ? renderCreateFilmOption : null;

        return (
            <HotkeysTarget2
                hotkeys={[
                    {
                        combo: "shift + o",
                        global: true,
                        label: "Show Omnibar",
                        onKeyDown: this.handleToggle,
                        // prevent typing "O" in omnibar input
                        preventDefault: true,
                    },
                ]}
            >
                <Example options={this.renderOptions()} {...this.props}>
                    <span>
                        <Button text="Click to show Omnibar" onClick={this.handleClick} />
                        {" or press "}
                        <KeyCombo combo="shift + o" />
                    </span>

                    <FilmOmnibar
                        {...this.state}
                        createNewItemFromQuery={maybeCreateNewItemFromQuery}
                        createNewItemRenderer={maybeCreateNewItemRenderer}
                        itemPredicate={filterFilm}
                        itemRenderer={renderFilm}
                        items={TOP_100_FILMS}
                        itemsEqual={areFilmsEqual}
                        noResults={<MenuItem disabled={true} text="No results." />}
                        onClose={this.handleClose}
                        onItemSelect={this.handleItemSelect}
                    />
                    <Toaster position={Position.TOP} ref={this.refHandlers.toaster} />
                </Example>
            </HotkeysTarget2>
        );
    }

    protected renderOptions() {
        return (
            <>
                <H5>Props</H5>
                <Switch label="Reset on select" checked={this.state.resetOnSelect} onChange={this.handleResetChange} />
                <Switch
                    label="Allow creating new films"
                    checked={this.state.allowCreate}
                    onChange={this.handleAllowCreateChange}
                />
            </>
        );
    }

    private handleClick = (_event: React.MouseEvent<HTMLElement>) => {
        this.setState({ isOpen: true });
    };

    private handleItemSelect = (film: IFilm) => {
        this.setState({ isOpen: false });

        this.toaster.show({
            message: (
                <span>
                    You selected <strong>{film.title}</strong>.
                </span>
            ),
        });
    };

    private handleClose = () => this.setState({ isOpen: false });

    private handleToggle = () => this.setState({ isOpen: !this.state.isOpen });
}
