"use node";

import opentype from "opentype.js";
import { GEIST_MONO_MEDIUM_BASE64 } from "./fontData";

interface TextItem {
  text: string;
  x: number;
  y: number;
  pathData: string;
  width: number;
}

interface SocialBadge {
  platform: string;
  count: number;
  iconSvg: string;
}

export async function generateHeaderSVG(
  githubStars: number,
  twitterFollowers: number,
  discordMembers: number
): Promise<string> {
  try {
    // Convert base64 font to buffer
    const fontBuffer = Buffer.from(GEIST_MONO_MEDIUM_BASE64, 'base64');
    
    // Parse the font
    const font = opentype.parse(fontBuffer.buffer);

    // Header dimensions from Figma
    const headerWidth = 830;
    const headerHeight = 48;
    const fontSize = 14; // Font size to render 20px tall text
    const textHeight = 20;
    const color = "#A1A1AA";
    const gap = 24; // Fixed 24px gap between all items
    
    // Vertical centering: center of 48px container
    const verticalCenter = headerHeight / 2;
    const textY = verticalCenter + (textHeight / 2) - 2; // Adjust for baseline

    // Left group items
    const leftGroupX = 0;
    const leftItems = ["DEMOS", "DOCS", "BLOG", "MERCH"];
    
    // Social badge configuration
    const socialBadges: SocialBadge[] = [
      {
        platform: "GITHUB",
        count: githubStars,
        iconSvg: `<path d="M12.5052 18.3337V15.0003C12.6211 13.9564 12.3218 12.9088 11.6719 12.0837C14.1719 12.0837 16.6719 10.417 16.6719 7.50033C16.7385 6.45866 16.4469 5.43366 15.8385 4.58366C16.0719 3.62533 16.0719 2.62533 15.8385 1.66699C15.8385 1.66699 15.0052 1.66699 13.3385 2.91699C11.1385 2.50033 8.87188 2.50033 6.67188 2.91699C5.00521 1.66699 4.17188 1.66699 4.17188 1.66699C3.92188 2.62533 3.92188 3.62533 4.17188 4.58366C3.5651 5.43023 3.2706 6.46098 3.33854 7.50033C3.33854 10.417 5.83854 12.0837 8.33854 12.0837C8.01354 12.492 7.77187 12.9587 7.63021 13.4587C7.48854 13.9587 7.44688 14.4837 7.50521 15.0003M7.50521 15.0003V18.3337M7.50521 15.0003C3.74688 16.667 3.33854 13.3337 1.67188 13.3337" stroke="#A1A1AA" stroke-linecap="round" stroke-linejoin="round"/>`
      },
      {
        platform: "TWITTER",
        count: twitterFollowers,
        iconSvg: `<path d="M18.3385 3.33368C18.3385 3.33368 17.7552 5.08368 16.6719 6.16701C18.0052 14.5003 8.83854 20.5837 1.67188 15.8337C3.50521 15.917 5.33854 15.3337 6.67188 14.167C2.50521 12.917 0.421875 8.00034 2.50521 4.16701C4.33854 6.33368 7.17188 7.58368 10.0052 7.50034C9.25521 4.00034 13.3385 2.00034 15.8385 4.33368C16.7552 4.33368 18.3385 3.33368 18.3385 3.33368Z" stroke="#A1A1AA" stroke-linecap="round" stroke-linejoin="round"/>`
      },
      {
        platform: "DISCORD",
        count: discordMembers,
        iconSvg: `<path d="M9.16663 4.99993H11.4107C11.5691 4.99993 11.7137 4.91021 11.784 4.76837L12.3492 3.62862C12.4351 3.45553 12.6277 3.36462 12.8134 3.41788C13.3595 3.5745 14.5057 3.95236 15.4202 4.58326C18.6401 6.99762 18.3398 12.408 18.3155 13.5507C18.314 13.6204 18.2962 13.6892 18.2618 13.7499C16.6092 16.6666 13.7425 16.6666 13.7425 16.6666L12.7706 14.6448M10.8333 4.99993H8.59324C8.43526 4.99993 8.29087 4.91059 8.22037 4.76922L7.65102 3.6276C7.56495 3.45502 7.37264 3.36452 7.18726 3.41767C6.64144 3.57416 5.49461 3.95207 4.57976 4.58326C1.3598 6.99762 1.66011 12.408 1.68446 13.5507C1.68595 13.6204 1.70376 13.6892 1.73815 13.7499C3.39074 16.6666 6.25743 16.6666 6.25743 16.6666L7.2324 14.6444M5.83436 14.1666C6.33408 14.3539 6.79635 14.5132 7.2324 14.6444M14.1698 14.1666C13.6697 14.3541 13.207 14.5135 12.7706 14.6448M7.2324 14.6444C9.26928 15.2572 10.734 15.2573 12.7706 14.6448M8.335 9.99993C8.335 10.4602 7.96181 10.8333 7.50145 10.8333C7.0411 10.8333 6.66791 10.4602 6.66791 9.99993C6.66791 9.53969 7.0411 9.16659 7.50145 9.16659C7.96181 9.16659 8.335 9.53969 8.335 9.99993ZM13.3363 9.99993C13.3363 10.4602 12.9631 10.8333 12.5027 10.8333C12.0424 10.8333 11.6692 10.4602 11.6692 9.99993C11.6692 9.53969 12.0424 9.16659 12.5027 9.16659C12.9631 9.16659 13.3363 9.53969 13.3363 9.99993Z" stroke="#A1A1AA" stroke-linecap="round" stroke-linejoin="round"/>`
      }
    ];
    
    // Note: Fourth item is cloud button (88px wide, 48px tall)
    const cloudButtonWidth = 88;

    // Helper function to measure text width
    function getTextWidth(text: string): number {
      const path = font.getPath(text, 0, fontSize, fontSize);
      const bbox = path.getBoundingBox();
      return Math.ceil(bbox.x2 - bbox.x1);
    }

    // Helper function to create text item
    function createTextItem(text: string, x: number): TextItem {
      const path = font.getPath(text, x, textY, fontSize);
      const bbox = path.getBoundingBox();
      const width = Math.ceil(bbox.x2 - bbox.x1);
      const pathData = path.toPathData(2);
      
      return {
        text,
        x,
        y: textY,
        pathData,
        width
      };
    }

    // Calculate left group layout (24px gaps)
    const leftTextItems: TextItem[] = [];
    const leftWidths = leftItems.map(getTextWidth);
    
    let leftCurrentX = leftGroupX;
    leftItems.forEach((text, i) => {
      leftTextItems.push(createTextItem(text, leftCurrentX));
      leftCurrentX += leftWidths[i] + gap;
    });

    // Calculate social badge dimensions
    interface SocialBadgeBox {
      x: number;
      y: number;
      width: number;
      height: number;
      iconX: number;
      iconY: number;
      iconSvg: string;
      countText: string;
      countPathData: string;
      countX: number;
      countY: number;
    }
    
    const badgeHeight = 28; // Height of the badge box
    const badgePadding = 8; // Horizontal padding inside badge
    const iconSize = 20;
    const iconTextGap = 6; // Gap between icon and count text
    
    // Create badge boxes for social items
    const socialBadgeBoxes: SocialBadgeBox[] = [];
    const badgeWidths: number[] = [];
    
    socialBadges.forEach((badge) => {
      const countText = badge.count.toLocaleString(); // Format number with commas
      const countWidth = getTextWidth(countText);
      const badgeWidth = badgePadding + iconSize + iconTextGap + countWidth + badgePadding;
      badgeWidths.push(badgeWidth);
    });
    
    // Calculate total width of right group
    const badgesTotalWidth = badgeWidths.reduce((a, b) => a + b, 0);
    const rightTotalWidth = badgesTotalWidth + cloudButtonWidth + (gap * socialBadges.length); // 3 gaps between badges + cloud button
    const rightGroupX = headerWidth - rightTotalWidth;
    
    // Position each badge
    let rightCurrentX = rightGroupX;
    socialBadges.forEach((badge, i) => {
      const badgeWidth = badgeWidths[i];
      const countText = badge.count.toLocaleString();
      
      // Badge box is vertically centered in the 48px header
      const badgeY = (headerHeight - badgeHeight) / 2;
      
      // Icon position (adjusted down 2px to align with text)
      const iconX = rightCurrentX + badgePadding;
      const iconY = badgeY + (badgeHeight - iconSize) / 2 + 2;
      
      // Count text position
      const countX = iconX + iconSize + iconTextGap;
      const countTextY = badgeY + (badgeHeight / 2) + (textHeight / 2) - 2; // Vertically center text
      const path = font.getPath(countText, countX, countTextY, fontSize);
      const countPathData = path.toPathData(2);
      
      socialBadgeBoxes.push({
        x: rightCurrentX,
        y: badgeY,
        width: badgeWidth,
        height: badgeHeight,
        iconX,
        iconY,
        iconSvg: badge.iconSvg,
        countText,
        countPathData,
        countX,
        countY: countTextY,
      });
      
      rightCurrentX += badgeWidth + gap;
    });
    
    // Cloud button position (last item in right group)
    const cloudButtonX = rightCurrentX;
    const cloudButtonY = 0; // Vertically centered (48px tall in 48px container)

    // Build the SVG
    // Left group text paths only
    const leftTextPaths = leftTextItems
      .map(item => `  <path d="${item.pathData}" fill="${color}"/>`)
      .join('\n');
    
    // Social badge boxes
    const socialBadgeSVG = socialBadgeBoxes.map((badge) => {
      return `  <g>
    <svg x="${badge.iconX}" y="${badge.iconY}" width="${iconSize}" height="${iconSize}" viewBox="0 0 20 20" fill="none">
      ${badge.iconSvg}
    </svg>
    <path d="${badge.countPathData}" fill="${color}"/>
  </g>`;
    }).join('\n');

    // Cloud button SVG (embedded, 88x48px)
    const cloudButtonSVG = `  <g transform="translate(${cloudButtonX}, ${cloudButtonY})">
    <mask id="path-1-inside-1_926_2269" fill="white">
      <path d="M0 0H4V4H0V0Z"/>
    </mask>
    <path d="M0 0V-1H-1V0H0ZM0 0V1H4V0V-1H0V0ZM0 4H1V0H0H-1V4H0Z" fill="#52525B" mask="url(#path-1-inside-1_926_2269)">
      <animate attributeName="fill" values="#52525B;#52525B;#FE750E;#52525B" keyTimes="0;0.1;0.55;1" dur="2s" repeatCount="indefinite" />
      <animateTransform attributeName="transform" type="translate" values="0,0;0,0;2,2;0,0" keyTimes="0;0.1;0.55;1" dur="2s" repeatCount="indefinite" />
    </path>
    <mask id="path-3-inside-2_926_2269" fill="white">
      <path d="M0 44H4V48H0V44Z"/>
    </mask>
    <path d="M0 48H-1V49H0V48ZM4 48V47H0V48V49H4V48ZM0 48H1V44H0H-1V48H0Z" fill="#52525B" mask="url(#path-3-inside-2_926_2269)">
      <animate attributeName="fill" values="#52525B;#52525B;#FE750E;#52525B" keyTimes="0;0.1;0.55;1" dur="2s" repeatCount="indefinite" />
      <animateTransform attributeName="transform" type="translate" values="0,0;0,0;2,-2;0,0" keyTimes="0;0.1;0.55;1" dur="2s" repeatCount="indefinite" />
    </path>
    <rect x="4" y="4" width="80" height="40" rx="20" fill="#FE750E">
      <animate attributeName="fill" values="#FE750E;#FE750E;#DB6103;#FE750E" keyTimes="0;0.1;0.55;1" dur="2s" repeatCount="indefinite" />
    </rect>
    <path d="M24.848 30.256C23.9307 30.256 23.152 30.016 22.512 29.536C21.8827 29.056 21.4027 28.3733 21.072 27.488C20.7413 26.6027 20.576 25.552 20.576 24.336C20.576 23.1093 20.7413 22.0533 21.072 21.168C21.4027 20.2827 21.8827 19.6 22.512 19.12C23.152 18.6293 23.9307 18.384 24.848 18.384C25.8827 18.384 26.752 18.7253 27.456 19.408C28.1707 20.0907 28.64 21.0453 28.864 22.272L27.104 22.368C26.944 21.5787 26.6613 20.9813 26.256 20.576C25.8613 20.16 25.392 19.952 24.848 19.952C24.2933 19.952 23.8293 20.1227 23.456 20.464C23.0827 20.8053 22.8 21.3013 22.608 21.952C22.416 22.6027 22.32 23.3973 22.32 24.336C22.32 25.264 22.416 26.0533 22.608 26.704C22.8 27.344 23.0827 27.8347 23.456 28.176C23.8293 28.5173 24.2933 28.688 24.848 28.688C25.4347 28.688 25.936 28.464 26.352 28.016C26.768 27.568 27.0453 26.912 27.184 26.048L28.928 26.128C28.736 27.4293 28.2827 28.4427 27.568 29.168C26.8533 29.8933 25.9467 30.256 24.848 30.256ZM31.1618 30V18.64H32.8418V29.36L31.8178 28.416H38.2658V30H31.1618ZM43.9875 30.256C43.0808 30.256 42.3128 30.0267 41.6835 29.568C41.0648 29.1093 40.5902 28.4373 40.2595 27.552C39.9288 26.6667 39.7635 25.5947 39.7635 24.336C39.7635 23.056 39.9288 21.9733 40.2595 21.088C40.5902 20.2027 41.0648 19.5307 41.6835 19.072C42.3128 18.6133 43.0808 18.384 43.9875 18.384C44.8942 18.384 45.6622 18.6133 46.2915 19.072C46.9208 19.5307 47.3955 20.2027 47.7155 21.088C48.0462 21.9733 48.2115 23.056 48.2115 24.336C48.2115 25.5947 48.0462 26.6667 47.7155 27.552C47.3955 28.4373 46.9208 29.1093 46.2915 29.568C45.6622 30.0267 44.8942 30.256 43.9875 30.256ZM43.9875 28.688C44.5208 28.688 44.9688 28.528 45.3315 28.208C45.7048 27.888 45.9875 27.4027 46.1795 26.752C46.3715 26.1013 46.4675 25.296 46.4675 24.336C46.4675 23.376 46.3715 22.5707 46.1795 21.92C45.9875 21.2587 45.7048 20.768 45.3315 20.448C44.9688 20.1173 44.5208 19.952 43.9875 19.952C43.4542 19.952 43.0008 20.1173 42.6275 20.448C42.2648 20.768 41.9875 21.2587 41.7955 21.92C41.6035 22.5707 41.5075 23.376 41.5075 24.336C41.5075 25.296 41.6035 26.1013 41.7955 26.752C41.9875 27.4027 42.2648 27.888 42.6275 28.208C43.0008 28.528 43.4542 28.688 43.9875 28.688ZM53.5813 30.256C52.3653 30.256 51.4159 29.8827 50.7333 29.136C50.0506 28.3893 49.7093 27.36 49.7093 26.048V18.64H51.3893V26.112C51.3893 26.944 51.5759 27.584 51.9493 28.032C52.3226 28.4693 52.8666 28.688 53.5813 28.688C54.2959 28.688 54.8399 28.4693 55.2133 28.032C55.5866 27.584 55.7733 26.944 55.7733 26.112V18.64H57.4533V26.048C57.4533 27.36 57.1119 28.3893 56.4293 29.136C55.7466 29.8827 54.7973 30.256 53.5813 30.256ZM59.703 30V18.64H62.471C63.4737 18.64 64.343 18.864 65.079 19.312C65.8257 19.7493 66.3963 20.3947 66.791 21.248C67.1963 22.0907 67.399 23.12 67.399 24.336C67.399 25.552 67.1963 26.5813 66.791 27.424C66.3963 28.2667 65.8257 28.9067 65.079 29.344C64.343 29.7813 63.4737 30 62.471 30H59.703ZM61.383 28.416H62.423C63.4577 28.416 64.2523 28.08 64.807 27.408C65.3723 26.7253 65.655 25.7013 65.655 24.336C65.655 22.9707 65.3723 21.9467 64.807 21.264C64.2523 20.5707 63.4577 20.224 62.423 20.224H61.383V28.416Z" fill="#FAFAF9"/>
    <mask id="path-7-inside-3_926_2269" fill="white">
      <path d="M84 0H88V4H84V0Z"/>
    </mask>
    <path d="M88 0H89V-1H88V0ZM84 0V1H88V0V-1H84V0ZM88 0H87V4H88H89V0H88Z" fill="#52525B" mask="url(#path-7-inside-3_926_2269)">
      <animate attributeName="fill" values="#52525B;#52525B;#FE750E;#52525B" keyTimes="0;0.1;0.55;1" dur="2s" repeatCount="indefinite" />
      <animateTransform attributeName="transform" type="translate" values="0,0;0,0;-2,2;0,0" keyTimes="0;0.1;0.55;1" dur="2s" repeatCount="indefinite" />
    </path>
    <mask id="path-9-inside-4_926_2269" fill="white">
      <path d="M84 44H88V48H84V44Z"/>
    </mask>
    <path d="M88 48V49H89V48H88ZM88 44H87V48H88H89V44H88ZM88 48V47H84V48V49H88V48Z" fill="#52525B" mask="url(#path-9-inside-4_926_2269)">
      <animate attributeName="fill" values="#52525B;#52525B;#FE750E;#52525B" keyTimes="0;0.1;0.55;1" dur="2s" repeatCount="indefinite" />
      <animateTransform attributeName="transform" type="translate" values="0,0;0,0;-2,-2;0,0" keyTimes="0;0.1;0.55;1" dur="2s" repeatCount="indefinite" />
    </path>
  </g>`;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${headerWidth}" height="${headerHeight}" viewBox="0 0 ${headerWidth} ${headerHeight}">
${leftTextPaths}
${socialBadgeSVG}
${cloudButtonSVG}
</svg>`;

    return svg;
  } catch (error) {
    console.error("Error generating header SVG:", error);
    throw new Error(`Failed to generate header SVG: ${error instanceof Error ? error.message : String(error)}`);
  }
}
