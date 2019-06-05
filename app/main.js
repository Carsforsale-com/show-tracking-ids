/*jshint strict:false, browser:true */

(function bookmarklet() {
    const styleBlock = document.createElement('style')
    styleBlock.innerHTML = `
        .trackinginfo {
            background: aliceblue;
            border: 2px solid;
            color: steelblue;
            opacity: 0;
            padding: .5em;
            position: fixed;
            top: 0;
            transition: opacity 350ms ease-in-out;
            z-index: -1;
        }

        .trackinginfo.show {
            opacity: 1;
            z-index: 99999;
        }

        .trackinginfo a {
            text-decoration: underline;
        }

        [data-trackingid],
        [data-trackingid]:hover,
        [data-trackingid]:active,
        [data-trackingid]:focus {
            cursor: pointer;
            outline: 2px red solid !important;
        }
    `
    document.head.appendChild(styleBlock)

    const instructions = document.createElement('div')
    instructions.classList.add('trackinginfo', 'show')
    instructions.innerHTML = `
        <p><strong>About Tracking IDs</strong></p>
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
    `
    instructions.addEventListener('click', function(e) {
        const item = e.target
        if (item && !item.hasAttribute('href')) {
            instructions.classList.remove('show')
        }
    })
    document.body.appendChild(instructions)

    const info = document.createElement('span')
    info.classList.add('trackinginfo')
    document.body.appendChild(info)

    function showTrackingInfo(event) {
        const x = event.clientX - 20
        const y = event.clientY + 40
        const target = event.currentTarget
        const trackingid = target.dataset.trackingid

        if (trackingid) {
            info.innerHTML = `
                <strong>Tracking ID:</strong> ${trackingid}<br />
                <strong>CSS Selector:</strong> [data-trackingid="${trackingid}"]
            `
            info.style.top = `${y}px`
            info.style.left = `${x}px`
            info.classList.add('show')
        }
    }

    function hideTrackingInfo() {
        info.classList.remove('show')
    }

    const trackingIDs = document.querySelectorAll('[data-trackingid]')

    for (const trackingID of trackingIDs) {
        trackingID.addEventListener('mousemove', showTrackingInfo)
        trackingID.addEventListener('mouseout', hideTrackingInfo)
    }
}());
