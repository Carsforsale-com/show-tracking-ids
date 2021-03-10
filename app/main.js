const trackingIdStyles = `
    [data-trackingid],
    [data-trackingid]:hover,
    [data-trackingid]:active,
    [data-trackingid]:focus {
        cursor: pointer;
        outline: 2px red solid !important;
    }
`;

class BookmarkletPopover extends HTMLElement {
    get observedAttributes() {
        return [
            'show',
        ];
    }

    get show() {
        return this.hasAttribute('show');
    }

    set show(val) {
        if (val) {
          this.setAttribute('show', '');
        } else {
          this.removeAttribute('show');
        }

        this.render();
    }

    constructor() {
        super();

        this.renderRoot = this.attachShadow({ mode: 'open' });
      }

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        this.renderRoot.innerHTML = `
            <style>
                :host {
                    --top: 0;
                    --left: 0;

                    display: block;
                }

                aside {
                    background: aliceblue;
                    border: 2px solid;
                    color: steelblue;
                    left: var(--left);
                    opacity: 1;
                    padding: .5em;
                    position: fixed;
                    top: var(--top);
                    transition: opacity 350ms ease-in-out;
                    z-index: 99999;
                }

                aside[hidden] {
                    opacity: 0;
                    z-index: -1;
                }

                a {
                    color: currentColor;
                    text-decoration: underline;
                }
            </style>
            <aside ${this.show ? '' : 'hidden'}>
                <slot></slot>
            </aside>
        `;
    }
}

window.customElements.define('let-popover', BookmarkletPopover);

class BookmarkletInstructions extends HTMLElement {
    constructor() {
        super();

        this.renderRoot = this.attachShadow({ mode: 'open' });

        this.hideInstructions = this.hideInstructions.bind(this);
      }

    connectedCallback() {
        this.render();

        this.renderRoot.querySelector('button').addEventListener('click', this.hideInstructions);
    }

    hideInstructions() {
        this.parentNode.removeChild(this);
    }

    render() {
        this.renderRoot.innerHTML = `
            <style>
                ${trackingIdStyles}
            </style>
            <let-popover show>
                <h1>About Tracking IDs</h1>
                <p>
                    The <span data-trackingid="fake-tracking-id">red boxes</span> on this page surround items that have tracking IDs on them.
                    These tracking IDs are implemented as data attributes. For example:
                </p>
                <p>
                    <code>&lt;a href="https://carsforsale.com" data-trackingid="item-tracking-id"&gt;Carsforsale.com&lt;/a&gt;</code>
                </p>
                <p>Hover over the red box to learn more about the tracking ID for that item.</p>
                <p>
                    Learn more about data attributes and Google Tag Manager
                    <a href="https://www.bounteous.com/insights/2017/07/07/track-more-click-detail-data-attributes-and-google-tag-manager/" target="_blank" rel="noopener">on Bounteous</a> and
                    <a href="https://www.thyngster.com/google-tag-manager-event-tracking-using-data-attribute-elements/" target="_blank" rel="noopener">on Thyngster</a>.
                </p>
                <p><button>Click to dismiss</button></p>
            </let-popover>
        `;
    }
}

window.customElements.define('let-instructions', BookmarkletInstructions);

(function main() {
    const styleBlock = document.createElement('style');
    styleBlock.innerHTML = trackingIdStyles;
    document.head.appendChild(styleBlock);

    const instructions = document.createElement('let-instructions');
    document.body.appendChild(instructions);

    const info = document.createElement('let-popover');
    document.body.appendChild(info);

    function showTrackingInfo(event) {
        const x = event.clientX - 20;
        const y = event.clientY + 40;
        const target = event.currentTarget;
        const trackingid = target.dataset.trackingid;

        if (trackingid) {
            info.innerHTML = `
                <strong>Tracking ID:</strong> ${trackingid}<br />
                <strong>CSS Selector:</strong><br />
                <code>
                    [data-trackingid="${trackingid}"],<br />
                    [data-trackingid="${trackingid}"] *
                </code>
            `;
            info.style.setProperty('--top', `${y}px`);
            info.style.setProperty('--left', `${x}px`);
            info.show = true;
        }
    }

    function hideTrackingInfo() {
        info.show = false;
    }

    const trackingIDs = document.querySelectorAll('[data-trackingid]');

    for (const trackingID of trackingIDs) {
        trackingID.addEventListener('mousemove', showTrackingInfo);
        trackingID.addEventListener('mouseout', hideTrackingInfo);
    }
}());
