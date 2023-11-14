// import stuff
import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import "./tv-channel.js";

export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.name = '';
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-app';
  }
  // LitElement convention so we update render() when values change
  
  static get properties() {
    return {
      name: { type: String },
      source: { type: String },
      listings: { type: Array },
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
      :host {
        display: block;
        margin: 16px;
        padding: 16px;
      }
      .tv-channels-wrapper {
        display: flex;
        overflow-x: auto;
      }
      .tv-channel {
        border: 1px solid #000;
        padding: 10px;
        margin: 10px;
        min-width: 200px;
      }
      `
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <h2>${this.name}</h2>
      <div>
      ${
        this.listings.map(
          (item) => html`
            <tv-channel 
              title="${item.title}"
              presenter="${item.metadata.author}"
              @click="${this.itemClick}"
            >
            </tv-channel>
          `
        )
      }
      <!-- is this correct? -->
      </div class="tv-channels-wrapper">
        <div class="tv-channel">

        </div>


      <div>
        <!-- video -->
        <!-- discord / chat - optional -->
      </div>
      <!-- dialog -->
      <sl-dialog label="Dialog" class="dialog">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        <sl-button slot="footer" variant="primary" @click="${this.closeDialog}">Close</sl-button>
      </sl-dialog>
    `;
  }

  closeDialog(e) {
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
  }

  itemClick(e) {
    console.log(e.target);
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.show();
  }

  // LitElement life cycle for when any property changes
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateSourceData(this[propName]);
      }
    });
  }

  async updateSourceData(source) {
    await fetch(source).then((resp) => resp.ok ? resp.json() : []).then((responseData) => {
      if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) {
        this.listings = [...responseData.data.items];
      }
    });
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);
