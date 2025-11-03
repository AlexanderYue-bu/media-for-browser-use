"use node";

import opentype from "opentype.js";
import { GEIST_MONO_MEDIUM_BASE64 } from "./fontData";
import { GITHUB_ICON } from "./assets/icons/github";
import { TWITTER_ICON } from "./assets/icons/twitter";
import { DISCORD_ICON } from "./assets/icons/discord";
import { PYPI_ICON } from "./assets/icons/pypi";
import { CLOUD_BUTTON_SVG } from "./assets/cloudButton";

let cachedFont: any = null;

function getFont() {
  if (!cachedFont) {
    const fontBuffer = Buffer.from(GEIST_MONO_MEDIUM_BASE64, 'base64');
    cachedFont = opentype.parse(fontBuffer.buffer);
  }
  return cachedFont;
}

const SOCIAL_ICONS: Record<string, string> = {
  github: GITHUB_ICON,
  twitter: TWITTER_ICON,
  discord: DISCORD_ICON,
  pypi: PYPI_ICON,
};

export async function generateTextBadge(text: string): Promise<string> {
  try {
    const font = getFont();
    const fontSize = 14;
    const textHeight = 20;
    const badgeHeight = 48;
    const color = "#A1A1AA";
    
    const textY = (badgeHeight / 2) + (textHeight / 2) - 2;
    
    const path = font.getPath(text, 0, textY, fontSize);
    const bbox = path.getBoundingBox();
    const width = Math.ceil(bbox.x2) + 1;
    const pathData = path.toPathData(2);
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${badgeHeight}" viewBox="0 0 ${width} ${badgeHeight}">
  <path d="${pathData}" fill="${color}"/>
</svg>`;
    
    return svg;
  } catch (error) {
    throw new Error(`Failed to generate text badge: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function generateSocialBadge(
  platform: 'github' | 'twitter' | 'discord' | 'pypi',
  count: number
): Promise<string> {
  try {
    const font = getFont();
    const fontSize = 14;
    const textHeight = 20;
    const containerHeight = 48;
    const badgeHeight = 28;
    const badgePadding = 8;
    const iconSize = 20;
    const iconTextGap = 6;
    const color = "#A1A1AA";
    
    const countText = count.toLocaleString();
    
    const path = font.getPath(countText, 0, fontSize, fontSize);
    const bbox = path.getBoundingBox();
    const countWidth = Math.ceil(bbox.x2) + 1;
    
    const badgeWidth = badgePadding + iconSize + iconTextGap + countWidth + badgePadding;
    
    const badgeY = (containerHeight - badgeHeight) / 2;
    const iconX = badgePadding;
    const iconY = badgeY + (badgeHeight - iconSize) / 2 + 2;
    
    const countX = iconX + iconSize + iconTextGap;
    const countTextY = badgeY + (badgeHeight / 2) + (textHeight / 2) - 2;
    const countPath = font.getPath(countText, countX, countTextY, fontSize);
    const countPathData = countPath.toPathData(2);
    
    const iconSvg = SOCIAL_ICONS[platform];
    const iconViewBox = platform === 'pypi' ? '0 0 14 14' : '0 0 20 20';
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${badgeWidth}" height="${containerHeight}" viewBox="0 0 ${badgeWidth} ${containerHeight}">
  <svg x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" viewBox="${iconViewBox}" fill="none">
    ${iconSvg}
  </svg>
  <path d="${countPathData}" fill="${color}"/>
</svg>`;
    
    return svg;
  } catch (error) {
    throw new Error(`Failed to generate social badge: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function generateCloudButton(): Promise<string> {
  return CLOUD_BUTTON_SVG;
}

interface TextSegment {
  text: string;
  color: string;
}

function parseColoredText(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  const grayColor = "#A1A1AA";
  const orangeColor = "#FE750E";
  
  let remaining = text;
  
  while (remaining.length > 0) {
    const orangeStart = remaining.indexOf('<orange>');
    
    if (orangeStart === -1) {
      segments.push({ text: remaining, color: grayColor });
      break;
    }
    
    if (orangeStart > 0) {
      segments.push({ text: remaining.substring(0, orangeStart), color: grayColor });
    }
    
    const contentStart = orangeStart + '<orange>'.length;
    const orangeEnd = remaining.indexOf('</orange>', contentStart);
    
    if (orangeEnd === -1) {
      segments.push({ text: remaining.substring(orangeStart), color: grayColor });
      break;
    }
    
    const orangeContent = remaining.substring(contentStart, orangeEnd);
    segments.push({ text: orangeContent, color: orangeColor });
    
    remaining = remaining.substring(orangeEnd + '</orange>'.length);
  }
  
  return segments;
}

export async function generateVerticalTextCarouselBadge(texts: string[]): Promise<string> {
  try {
    const font = getFont();
    const fontSize = 14;
    const textHeight = 20;
    const badgeHeight = 48;
    
    const holdDuration = 1.5;
    const transitionDuration = 0.4;
    const totalDuration = texts.length * (holdDuration + transitionDuration);
    
    const textY = (badgeHeight / 2) + (textHeight / 2) - 2;
    
    let maxWidth = 0;
    const textWidths: number[] = [];
    const parsedTexts: TextSegment[][] = [];
    
    for (const text of texts) {
      const segments = parseColoredText(text);
      parsedTexts.push(segments);
      
      let totalWidth = 0;
      for (const segment of segments) {
        const measurePath = font.getPath(segment.text, 0, textY, fontSize);
        const bbox = measurePath.getBoundingBox();
        const width = Math.ceil(bbox.x2) + 1;
        totalWidth += width;
      }
      
      textWidths.push(totalWidth);
      maxWidth = Math.max(maxWidth, totalWidth);
    }
    
    const textSegmentGroups: Array<Array<{ pathData: string; color: string; width: number }>> = [];
    
    for (let i = 0; i < parsedTexts.length; i++) {
      const segments = parsedTexts[i];
      const textWidth = textWidths[i];
      const startX = (maxWidth - textWidth) / 2;
      
      const segmentPaths: Array<{ pathData: string; color: string; width: number }> = [];
      let xOffset = startX;
      
      for (const segment of segments) {
        const measurePath = font.getPath(segment.text, 0, textY, fontSize);
        const bbox = measurePath.getBoundingBox();
        const width = Math.ceil(bbox.x2) + 1;
        
        const finalPath = font.getPath(segment.text, xOffset, textY, fontSize);
        const pathData = finalPath.toPathData(2);
        
        segmentPaths.push({ pathData, color: segment.color, width });
        xOffset += width;
      }
      
      textSegmentGroups.push(segmentPaths);
    }
    
    const pathElements = textSegmentGroups.map((segmentGroup, i) => {
      const cycleStart = i * (holdDuration + transitionDuration);
      const fadeOutStart = cycleStart + holdDuration;
      const fadeOutEnd = cycleStart + holdDuration + transitionDuration;
      
      const visibleTime = cycleStart / totalDuration;
      const fadeOutTime = fadeOutStart / totalDuration;
      const hiddenTime = fadeOutEnd / totalDuration;
      
      const nextVisibleTime = ((i + 1) * (holdDuration + transitionDuration)) / totalDuration;
      
      const opacityValues = `0;0;1;1;0;0`;
      
      const opacityKeyTimes = i === texts.length - 1
        ? `0;${visibleTime};${visibleTime};${fadeOutTime};${hiddenTime};1`
        : `0;${visibleTime};${visibleTime};${fadeOutTime};${nextVisibleTime};1`;
      
      const translateValues = `0,${badgeHeight};0,${badgeHeight};0,0;0,0;0,-${badgeHeight};0,${badgeHeight}`;
      
      const translateKeyTimes = i === texts.length - 1
        ? `0;${visibleTime};${visibleTime};${fadeOutTime};${hiddenTime};1`
        : `0;${visibleTime};${visibleTime};${fadeOutTime};${nextVisibleTime};1`;
      
      const pathsMarkup = segmentGroup.map(segment => 
        `    <path d="${segment.pathData}" fill="${segment.color}">
      <animate attributeName="opacity" values="${opacityValues}" keyTimes="${opacityKeyTimes}" dur="${totalDuration}s" repeatCount="indefinite" />
    </path>`
      ).join('\n');
      
      return `  <g>
${pathsMarkup}
    <animateTransform attributeName="transform" type="translate" values="${translateValues}" keyTimes="${translateKeyTimes}" dur="${totalDuration}s" repeatCount="indefinite" additive="sum" />
  </g>`;
    }).join('\n');
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.ceil(maxWidth)}" height="${badgeHeight}" viewBox="0 0 ${Math.ceil(maxWidth)} ${badgeHeight}">
${pathElements}
</svg>`;
    
    return svg;
  } catch (error) {
    throw new Error(`Failed to generate vertical text carousel badge: ${error instanceof Error ? error.message : String(error)}`);
  }
}