import React, { useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';

export default function CampaignPlanner() {
  const [campaignName, setCampaignName] = useState('');
  const [duration, setDuration] = useState(8);
  const [mainOffer, setMainOffer] = useState('');
  const [supportingContent, setSupportingContent] = useState([]);
  const [weeklyPlan, setWeeklyPlan] = useState({});
  const [showSetup, setShowSetup] = useState(true);

  // Initialize weeks when duration changes
  React.useEffect(() => {
    const newWeeklyPlan = {};
    for (let i = 1; i <= duration; i++) {
      if (!weeklyPlan[i]) {
        newWeeklyPlan[i] = { cow: [], wbi: [] };
      } else {
        newWeeklyPlan[i] = weeklyPlan[i];
      }
    }
    setWeeklyPlan(newWeeklyPlan);
  }, [duration]);

  const addSupportingContent = () => {
    setSupportingContent([...supportingContent, { title: '', brand: 'COW', type: 'Blog' }]);
  };

  const updateSupportingContent = (index, field, value) => {
    const updated = [...supportingContent];
    updated[index][field] = value;
    setSupportingContent(updated);
  };

  const removeSupportingContent = (index) => {
    setSupportingContent(supportingContent.filter((_, i) => i !== index));
  };

  const addEmail = (week, brand) => {
    const updated = { ...weeklyPlan };
    updated[week][brand].push({ promotes: mainOffer, type: 'Announcement' });
    setWeeklyPlan(updated);
  };

  const updateEmail = (week, brand, emailIndex, field, value) => {
    const updated = { ...weeklyPlan };
    updated[week][brand][emailIndex][field] = value;
    setWeeklyPlan(updated);
  };

  const removeEmail = (week, brand, emailIndex) => {
    const updated = { ...weeklyPlan };
    updated[week][brand].splice(emailIndex, 1);
    setWeeklyPlan(updated);
  };

  const calculateAdRequirements = () => {
    const promoted = new Set();
    
    // Add main offer
    if (mainOffer) {
      promoted.add(`${mainOffer}|COW`);
      promoted.add(`${mainOffer}|WBI`);
    }

    // Add supporting content
    supportingContent.forEach(content => {
      if (content.title) {
        promoted.add(`${content.title}|${content.brand}`);
      }
    });

    const cowAds = Array.from(promoted).filter(p => p.endsWith('|COW')).length * 2;
    const wbiAds = Array.from(promoted).filter(p => p.endsWith('|WBI')).length * 2;

    return { cow: cowAds, wbi: wbiAds, total: cowAds + wbiAds };
  };

  const getAllAssets = () => {
    const assets = {
      cowEmails: [],
      wbiEmails: [],
      cowAds: [],
      wbiAds: [],
      supportingContent: []
    };

    // Collect emails
    Object.keys(weeklyPlan).forEach(week => {
      weeklyPlan[week].cow.forEach((email, idx) => {
        assets.cowEmails.push({
          week,
          type: email.type,
          promotes: email.promotes,
          id: `cow-w${week}-${idx}`
        });
      });
      weeklyPlan[week].wbi.forEach((email, idx) => {
        assets.wbiEmails.push({
          week,
          type: email.type,
          promotes: email.promotes,
          id: `wbi-w${week}-${idx}`
        });
      });
    });

    // Calculate ads
    const promoted = new Set();
    if (mainOffer) {
      promoted.add(`${mainOffer}|COW`);
      promoted.add(`${mainOffer}|WBI`);
    }
    supportingContent.forEach(content => {
      if (content.title) {
        promoted.add(`${content.title}|${content.brand}`);
      }
    });

    Array.from(promoted).forEach(item => {
      const [title, brand] = item.split('|');
      if (brand === 'COW') {
        assets.cowAds.push({ title, variations: 2 });
      } else {
        assets.wbiAds.push({ title, variations: 2 });
      }
    });

    // Supporting content
    assets.supportingContent = supportingContent.filter(c => c.title);

    return assets;
  };

  const ads = calculateAdRequirements();
  const assets = getAllAssets();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Campaign Planning Tool</h1>
          <p className="text-gray-600">Plan and visualize your multi-brand campaign execution</p>
        </div>

        {/* Campaign Setup */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Campaign Setup</h2>
            <button
              onClick={() => setShowSetup(!showSetup)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {showSetup ? 'Hide' : 'Show'} Setup
            </button>
          </div>

          {showSetup && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="e.g., State of Well-Being Report 2025"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={4}>4 Weeks</option>
                    <option value={6}>6 Weeks</option>
                    <option value={8}>8 Weeks</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Main Offer/Gated Content
                </label>
                <input
                  type="text"
                  value={mainOffer}
                  onChange={(e) => setMainOffer(e.target.value)}
                  placeholder="e.g., 2025 State of Well-Being Report"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Supporting Content Pieces
                  </label>
                  <button
                    onClick={addSupportingContent}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    <Plus size={16} />
                    Add Content
                  </button>
                </div>
                <div className="space-y-2">
                  {supportingContent.map((content, index) => (
                    <div key={index} className="flex gap-2 items-start p-3 bg-gray-50 rounded-md">
                      <input
                        type="text"
                        value={content.title}
                        onChange={(e) => updateSupportingContent(index, 'title', e.target.value)}
                        placeholder="Content title"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <select
                        value={content.type}
                        onChange={(e) => updateSupportingContent(index, 'type', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option>Blog</option>
                        <option>Video</option>
                        <option>Webinar</option>
                        <option>Guide</option>
                        <option>Infographic</option>
                      </select>
                      <select
                        value={content.brand}
                        onChange={(e) => updateSupportingContent(index, 'brand', e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option>COW</option>
                        <option>WBI</option>
                      </select>
                      <button
                        onClick={() => removeSupportingContent(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  {supportingContent.length === 0 && (
                    <p className="text-gray-500 text-sm italic text-center py-4">
                      No supporting content added yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Weekly Plan */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Weekly Email Plan</h2>
          <div className="space-y-4">
            {Object.keys(weeklyPlan).map((week) => (
              <div key={week} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Week {week}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Champions of Wellness */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-green-700">Champions of Wellness</h4>
                      <button
                        onClick={() => addEmail(week, 'cow')}
                        className="text-green-600 hover:text-green-700 p-1"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {weeklyPlan[week].cow.map((email, idx) => (
                        <div key={idx} className="bg-green-50 p-2 rounded-md">
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <select
                              value={email.type}
                              onChange={(e) => updateEmail(week, 'cow', idx, 'type', e.target.value)}
                              className="text-sm px-2 py-1 border border-green-200 rounded flex-1"
                            >
                              <option>Announcement</option>
                              <option>Reminder</option>
                              <option>Invite</option>
                              <option>Last Chance</option>
                              <option>Blog Promo</option>
                            </select>
                            <button
                              onClick={() => removeEmail(week, 'cow', idx)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <select
                            value={email.promotes}
                            onChange={(e) => updateEmail(week, 'cow', idx, 'promotes', e.target.value)}
                            className="text-sm px-2 py-1 border border-green-200 rounded w-full"
                          >
                            {mainOffer && <option value={mainOffer}>{mainOffer} (Main Offer)</option>}
                            {supportingContent.map((content, cidx) => (
                              content.title && <option key={cidx} value={content.title}>{content.title}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                      {weeklyPlan[week].cow.length === 0 && (
                        <p className="text-gray-400 text-sm italic">No emails scheduled</p>
                      )}
                    </div>
                  </div>

                  {/* Well-Being Index */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-blue-700">Well-Being Index</h4>
                      <button
                        onClick={() => addEmail(week, 'wbi')}
                        className="text-blue-600 hover:text-blue-700 p-1"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {weeklyPlan[week].wbi.map((email, idx) => (
                        <div key={idx} className="bg-blue-50 p-2 rounded-md">
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <select
                              value={email.type}
                              onChange={(e) => updateEmail(week, 'wbi', idx, 'type', e.target.value)}
                              className="text-sm px-2 py-1 border border-blue-200 rounded flex-1"
                            >
                              <option>Announcement</option>
                              <option>Reminder</option>
                              <option>Invite</option>
                              <option>Last Chance</option>
                              <option>Blog Promo</option>
                            </select>
                            <button
                              onClick={() => removeEmail(week, 'wbi', idx)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <select
                            value={email.promotes}
                            onChange={(e) => updateEmail(week, 'wbi', idx, 'promotes', e.target.value)}
                            className="text-sm px-2 py-1 border border-blue-200 rounded w-full"
                          >
                            {mainOffer && <option value={mainOffer}>{mainOffer} (Main Offer)</option>}
                            {supportingContent.map((content, cidx) => (
                              content.title && <option key={cidx} value={content.title}>{content.title}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                      {weeklyPlan[week].wbi.length === 0 && (
                        <p className="text-gray-400 text-sm italic">No emails scheduled</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ad Requirements */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ad Requirements</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
              <div className="text-sm text-green-700 font-medium">COW Ads</div>
              <div className="text-3xl font-bold text-green-900">{ads.cow}</div>
              <div className="text-xs text-green-600">2 variations each</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
              <div className="text-sm text-blue-700 font-medium">WBI Ads</div>
              <div className="text-3xl font-bold text-blue-900">{ads.wbi}</div>
              <div className="text-xs text-blue-600">2 variations each</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <div className="text-sm text-purple-700 font-medium">Total Ads</div>
              <div className="text-3xl font-bold text-purple-900">{ads.total}</div>
              <div className="text-xs text-purple-600">Run throughout campaign</div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Each promoted piece (main offer + supporting content) needs 2 ad variations per brand
          </p>
        </div>

        {/* Master Production Checklist */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Master Production Checklist</h2>
          
          <div className="grid grid-cols-2 gap-6">
            {/* COW Assets */}
            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Champions of Wellness
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-700 text-sm mb-2">Emails ({assets.cowEmails.length})</h4>
                  <div className="space-y-1">
                    {assets.cowEmails.map((email, idx) => (
                      <div key={email.id} className="text-sm bg-green-50 p-2 rounded">
                        Week {email.week}: {email.type} → {email.promotes}
                      </div>
                    ))}
                    {assets.cowEmails.length === 0 && <p className="text-gray-400 text-sm italic">No emails</p>}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 text-sm mb-2">Ads ({assets.cowAds.length} sets, {assets.cowAds.length * 2} total)</h4>
                  <div className="space-y-1">
                    {assets.cowAds.map((ad, idx) => (
                      <div key={idx} className="text-sm bg-green-50 p-2 rounded">
                        {ad.title} (2 variations)
                      </div>
                    ))}
                    {assets.cowAds.length === 0 && <p className="text-gray-400 text-sm italic">No ads</p>}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 text-sm mb-2">
                    Supporting Content ({assets.supportingContent.filter(c => c.brand === 'COW').length})
                  </h4>
                  <div className="space-y-1">
                    {assets.supportingContent.filter(c => c.brand === 'COW').map((content, idx) => (
                      <div key={idx} className="text-sm bg-green-50 p-2 rounded">
                        {content.type}: {content.title}
                      </div>
                    ))}
                    {assets.supportingContent.filter(c => c.brand === 'COW').length === 0 && (
                      <p className="text-gray-400 text-sm italic">No content</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* WBI Assets */}
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Well-Being Index
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-700 text-sm mb-2">Emails ({assets.wbiEmails.length})</h4>
                  <div className="space-y-1">
                    {assets.wbiEmails.map((email, idx) => (
                      <div key={email.id} className="text-sm bg-blue-50 p-2 rounded">
                        Week {email.week}: {email.type} → {email.promotes}
                      </div>
                    ))}
                    {assets.wbiEmails.length === 0 && <p className="text-gray-400 text-sm italic">No emails</p>}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 text-sm mb-2">Ads ({assets.wbiAds.length} sets, {assets.wbiAds.length * 2} total)</h4>
                  <div className="space-y-1">
                    {assets.wbiAds.map((ad, idx) => (
                      <div key={idx} className="text-sm bg-blue-50 p-2 rounded">
                        {ad.title} (2 variations)
                      </div>
                    ))}
                    {assets.wbiAds.length === 0 && <p className="text-gray-400 text-sm italic">No ads</p>}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 text-sm mb-2">
                    Supporting Content ({assets.supportingContent.filter(c => c.brand === 'WBI').length})
                  </h4>
                  <div className="space-y-1">
                    {assets.supportingContent.filter(c => c.brand === 'WBI').map((content, idx) => (
                      <div key={idx} className="text-sm bg-blue-50 p-2 rounded">
                        {content.type}: {content.title}
                      </div>
                    ))}
                    {assets.supportingContent.filter(c => c.brand === 'WBI').length === 0 && (
                      <p className="text-gray-400 text-sm italic">No content</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {assets.cowEmails.length + assets.wbiEmails.length}
                </div>
                <div className="text-sm text-gray-600">Total Emails</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {ads.total}
                </div>
                <div className="text-sm text-gray-600">Total Ads</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {assets.supportingContent.length}
                </div>
                <div className="text-sm text-gray-600">Content Pieces</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {assets.cowEmails.length + assets.wbiEmails.length + ads.total + assets.supportingContent.length}
                </div>
                <div className="text-sm text-gray-600">Total Assets</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}