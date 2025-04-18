/**
 * @license
 * Copyright 2021 Google Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import "#src/ui/viewer_settings.css";

import { TrackableBooleanCheckbox } from "#src/trackable_boolean.js";
import type {
  TrackableValue,
  WatchableValueInterface,
} from "#src/trackable_value.js";
import type { SidePanelManager } from "#src/ui/side_panel.js";
import { SidePanel } from "#src/ui/side_panel.js";
import type { SidePanelLocation } from "#src/ui/side_panel_location.js";
import {
  DEFAULT_SIDE_PANEL_LOCATION,
  TrackableSidePanelLocation,
} from "#src/ui/side_panel_location.js";
import type { vec3 } from "#src/util/geom.js";
import { emptyToUndefined } from "#src/util/json.js";
import type { Viewer } from "#src/viewer.js";
import { ColorWidget } from "#src/widget/color.js";
import { NumberInputWidget } from "#src/widget/number_input_widget.js";
import { TextInputWidget } from "#src/widget/text_input.js";

const DEFAULT_SETTINGS_PANEL_LOCATION: SidePanelLocation = {
  ...DEFAULT_SIDE_PANEL_LOCATION,
  side: "left",
  row: 2,
};

export class ViewerSettingsPanelState {
  location = new TrackableSidePanelLocation(DEFAULT_SETTINGS_PANEL_LOCATION);
  get changed() {
    return this.location.changed;
  }
  toJSON() {
    return emptyToUndefined(this.location.toJSON());
  }
  reset() {
    this.location.reset();
  }
  restoreState(obj: unknown) {
    this.location.restoreState(obj);
  }
}

export class ViewerSettingsPanel extends SidePanel {
  constructor(
    sidePanelManager: SidePanelManager,
    state: ViewerSettingsPanelState,
    viewer: Viewer,
  ) {
    super(sidePanelManager, state.location);
    this.addTitleBar({ title: "Settings" });

    const body = document.createElement("div");
    body.classList.add("neuroglancer-settings-body");

    const scroll = document.createElement("div");
    scroll.classList.add("neuroglancer-settings-scroll-container");
    body.appendChild(scroll);
    this.addBody(body);

    {
      const titleWidget = this.registerDisposer(
        new TextInputWidget(viewer.title),
      );
      titleWidget.element.placeholder = "Title";
      titleWidget.element.classList.add("neuroglancer-settings-title");
      scroll.appendChild(titleWidget.element);
    }

    const addLimitWidget = (label: string, limit: TrackableValue<number>) => {
      const widget = this.registerDisposer(
        new NumberInputWidget(limit, { label }),
      );
      widget.element.classList.add("neuroglancer-settings-limit-widget");
      scroll.appendChild(widget.element);
    };
    addLimitWidget(
      "GPU memory limit",
      viewer.chunkQueueManager.capacities.gpuMemory.sizeLimit,
    );
    addLimitWidget(
      "System memory limit",
      viewer.chunkQueueManager.capacities.systemMemory.sizeLimit,
    );
    addLimitWidget(
      "Concurrent chunk requests",
      viewer.chunkQueueManager.capacities.download.itemLimit,
    );

    const addCheckbox = (
      label: string,
      value: WatchableValueInterface<boolean>,
    ) => {
      const labelElement = document.createElement("label");
      labelElement.textContent = label;
      const checkbox = this.registerDisposer(
        new TrackableBooleanCheckbox(value),
      );
      labelElement.appendChild(checkbox.element);
      scroll.appendChild(labelElement);
    };
    addCheckbox("Show axis lines", viewer.showAxisLines);
    addCheckbox("Show scale bar", viewer.showScaleBar);
    addCheckbox("Show cross sections in 3-d", viewer.showPerspectiveSliceViews);
    addCheckbox(
      "Hide sections background 3-d",
      viewer.hideCrossSectionBackground3D,
    );
    addCheckbox("Show default annotations", viewer.showDefaultAnnotations);
    addCheckbox(
      "Show chunk statistics",
      viewer.statisticsDisplayState.location.watchableVisible,
    );
    addCheckbox("Wire frame rendering", viewer.wireFrame);
    addCheckbox("Enable prefetching", viewer.chunkQueueManager.enablePrefetch);
    addCheckbox(
      "Enable adaptive downsampling",
      viewer.enableAdaptiveDownsampling,
    );

    const addColor = (label: string, value: WatchableValueInterface<vec3>) => {
      const labelElement = document.createElement("label");
      labelElement.textContent = label;
      const widget = this.registerDisposer(new ColorWidget(value));
      labelElement.appendChild(widget.element);
      scroll.appendChild(labelElement);
    };

    addColor("Cross-section background", viewer.crossSectionBackgroundColor);
    addColor("Projection background", viewer.perspectiveViewBackgroundColor);
  }
}
